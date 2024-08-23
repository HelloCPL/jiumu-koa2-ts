#!/bin/bash

# 1. 定义相关变量及引入公共函数

jm_myenv=test                              # 指定发布的环境
jm_branch=test                             # 指定发布的分支名称
jm_base_dir=/data/front/jiumu-pc           # 基础项目服务目录路径
jm_back_dir=/data/backups/jiumu-pc         # 项目打包记录存放目录路径
jm_back_dir_time=$(date "+%Y-%m-%d-%H-%M") # 项目记录存放时间
jm_target_dir=/usr/local/nginx/html        # 项目目录路径
jm_target_file=jiumu-pc-${jm_myenv}        # 项目目录名称
jm_start_time=$(date +%s)                  # 项目开始运行时间，单位 s

source ./common_functions.sh

jm_fn_log "开始构建 ${jm_target_file} 项目"

# 2. 进入指定项目存放目录
cd ${jm_base_dir}

if [[ -d "${jm_target_file}" ]]; then
  # 2.1 若已存在代码仓库，则直接更新代码
  jm_fn_log "正在更新项目代码"
  cd ${jm_target_file}
  git pull origin ${jm_branch} || {
    jm_fn_build_error
    exit 1
  }
else
  # 2.2 若不存在，则下载代码仓库
  jm_fn_log "正在下载项目代码"
  git clone 'git@github.com:HelloCPL/jiumu.git' -b ${jm_branch} "${jm_target_file}" || {
    jm_fn_build_error
    exit 1
  }
  cd ${jm_target_file} || {
    jm_fn_build_error
    exit 1
  }
fi

# 复制私密配置信息文件到项目，该文件信息由于比较私密不在github仓库中需另行拷贝
mkdir -p "${jm_base_dir}/${jm_target_file}/config"
cp -f "${jm_base_dir}/secret/secret.ts" "${jm_base_dir}/${jm_target_file}/config/secret.ts"

# 3. 下载项目依赖
jm_fn_log "正在下载项目依赖"
pnpm i || {
  jm_fn_build_error
  exit 1
}

# 4. 打包项目
jm_fn_log "正在打包项目"
increase-memory-limit
pnpm run pc:test

if [ -d "${jm_base_dir}/${jm_target_file}/packages/pc/dist" ]; then
  # 5. 更新网站资源
  jm_fn_log "正在更新网站资源"
  if [ -d "${jm_target_dir}/${jm_target_file}" ]; then
    rm -rf ${jm_target_dir}/${jm_target_file}
  fi
  mkdir -p ${jm_target_dir}/${jm_target_file}
  cd ${jm_base_dir}/${jm_target_file}/packages/pc/dist
  cp -r . "${jm_target_dir}/${jm_target_file}"

  # 6. 备份构建记录
  jm_fn_log "正在备份构建记录"
  mkdir -p ${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}
  cd ${jm_base_dir}/${jm_target_file}/packages/pc/dist
  cp -r . "${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}"
  jm_fn_build_success
else
  jm_fn_build_error
fi

# pc端测试环境（增量打包）特点
# 每次只更新项目新的代码，整个构建时间较短
# 遵循 git pull 更新原则，极端情况下可能出现新代码不同步情况

# 以下为测试环境（增量打包）构建逻辑
# 1. 定义相关变量及引入公共函数
# 2. 进入指定项目存放目录
#   2.1 若已存在代码仓库，则直接更新代码
#   2.2 若不存在，则下载代码仓库
# 复制私密配置文件到项目目录
# 3. 下载项目依赖
# 4. 打包项目
# 5. 更新网站资源
# 6. 备份构建记录，构建完成
