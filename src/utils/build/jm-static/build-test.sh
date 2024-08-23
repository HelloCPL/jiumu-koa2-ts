#!/bin/bash

# 1. 定义相关变量及引入公共函数

jm_myenv=test                           # 指定发布的环境
jm_branch=test                          # 指定发布的分支名称
jm_myport=7301                          # 指定服务端口号
jm_base_dir=/data/front/jiumu-static    # 基础项目服务目录路径
jm_target_file=jiumu-static-${jm_myenv} # 项目目录名称
jm_pm2_name=jiumu-static-${jm_myenv}    # pm2 运行名称
jm_start_time=$(date +%s)               # 项目开始运行时间，单位 s

source ./common_functions.sh

jm_fn_log "开始构建 ${jm_target_file} 项目"

# 2. 停止并删除旧的服务实例
jm_fn_log "pm2 停止并删除旧的服务实例"
pm2 stop ${jm_pm2_name} && pm2 delete ${jm_pm2_name} || true

# 3. 进入指定项目存放目录
cd ${jm_base_dir}

if [[ -d "${jm_target_file}" ]]; then
  # 3.1 若已存在代码仓库，则直接更新代码
  jm_fn_log "正在更新项目代码"
  cd "${jm_target_file}"
  git pull origin ${jm_branch} || {
    jm_fn_build_error
    exit 1
  }
else
  # 3.2 若不存在，则下载代码仓库
  jm_fn_log "正在下载项目代码"
  git clone 'git@github.com:HelloCPL/jiumu-static.git' -b ${jm_branch} "${jm_target_file}" || {
    jm_fn_build_error
    exit 1
  }
  cd "${jm_target_file}" || {
    jm_fn_build_error
    exit 1
  }
fi

# 4. 启动新服务实例，构建完成
jm_fn_log "正在启动新服务实例"
pm2 start "http-server ./ -p ${jm_myport} --cors --gzip true -d false" --name ${jm_pm2_name}
jm_fn_build_success

# 静态资源托管服务测试环境（增量打包）打包特点
# 每次只更新项目新的代码，整个构建时间较短
# 遵循 git pull 更新原则，极端情况下可能出现新代码不同步情况
# 先停止原有服务，后更新代码，对原有服务时间影响较长

# 以下为测试环境（增量打包）构建逻辑
# 1. 定义相关变量及引入公共函数
# 2. 停止并删除旧的服务实例（防止实例对本地文件上锁）
# 3. 进入指定项目存放目录
#   3.1 若已存在代码仓库，则直接更新代码
#   3.2 若不存在，则下载代码仓库
# 4. 启动新服务实例，构建完成
