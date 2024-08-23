#!/bin/bash

# 1. 定义相关变量及引入公共函数

jm_myenv=prod                           # 指定发布的环境
jm_branch=main                          # 指定发布的分支名称
jm_myport=7302                          # 指定服务端口号
jm_base_dir=/data/front/jiumu-static    # 基础项目服务目录路径
jm_tmp_dir=/tmp/source                  # 临时存放项目路径
jm_target_file=jiumu-static-${jm_myenv} # 项目目录名称
jm_pm2_name=jiumu-static-${jm_myenv}    # pm2 运行名称
jm_start_time=$(date +%s)               # 项目开始运行时间，单位 s

source ./common_functions.sh

jm_fn_log "开始构建 ${jm_target_file} 项目"

# 2. 进入临时存放目录下载全新项目代码
cd ${jm_tmp_dir}
if [ -d "${jm_target_file}" ]; then
  rm -rf ${jm_target_file}
fi

jm_fn_log "正在下载项目代码"
git clone 'git@github.com:HelloCPL/jiumu-static.git' -b ${jm_branch} "${jm_target_file}" || {
  jm_fn_build_error
  exit 1
}
cd "${jm_target_file}" || {
  jm_fn_build_error
  exit 1
}

# 3. 停止并删除旧的服务实例，并删除原有项目代码
jm_fn_log "pm2 停止并删除旧的服务实例"
pm2 stop ${jm_pm2_name} && pm2 delete ${jm_pm2_name} || true

cd ${jm_base_dir}
if [[ -d "${jm_target_file}" ]]; then
  rm -rf ${jm_target_file}
fi

# 4. 复制项目新代码到指定存放目录
jm_fn_log "正在复制项目新代码到指定存放目录"
mkdir -p ${jm_base_dir}/${jm_target_file}
mv -vf ${jm_tmp_dir}/${jm_target_file}/{.*,}* "${jm_base_dir}/${jm_target_file}/"

cd "${jm_base_dir}/${jm_target_file}" || {
  jm_fn_build_error
  exit 1
}

# 5. 启动项目服务，构建完成
jm_fn_log "正在启动新服务实例"
pm2 start "http-server ./ -p ${jm_myport} --cors --gzip true -d false" --name ${jm_pm2_name}
jm_fn_build_success

# 静态资源托管服务正式环境（全量打包）打包特点
# 每次都全面更新整个项目代码并重新安装依赖，构建时间教长
# 全面更新，完全同步最新代码
# 先更新代码，后停止原有服务，对原有服务时间影响较短

# 以下为正式环境（全量打包）构建逻辑
# 1. 定义相关变量及函数
# 2. 进入临时存放目录下载全新项目代码
# 3. 停止并删除旧的服务实例，并删除原有项目代码
# 4. 复制项目新代码到指定存放目录
# 5. 启动新服务实例，构建完成
