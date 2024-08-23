#!/bin/bash

# 1. 定义相关变量及引入公共函数

jm_myenv=prod                              # 指定发布的环境
jm_branch=main                             # 指定发布的分支名称
jm_base_dir=/data/front/jiumu-koa2-ts      # 基础项目目录路径
jm_back_dir=/data/backups/jiumu-koa2-ts    # 项目记录存放目录路径
jm_back_dir_time=$(date "+%Y-%m-%d-%H-%M") # 项目记录存放时间
jm_tmp_dir=/tmp/source                     # 临时存放项目路径
jm_target_file=jiumu-koa2-ts-${jm_myenv}   # 项目目录名称
jm_pm2_name=jiumu-koa2-ts-${jm_myenv}      # pm2 运行名称
jm_start_time=$(date +%s)                  # 项目开始运行时间，单位 s

source ./common_functions.sh

jm_fn_log "开始构建 ${jm_target_file} 项目"

# 2. 进入临时存放目录并下载代码仓库
jm_fn_log "进入临时目录：${jm_tmp_dir}"
cd ${jm_tmp_dir}
if [ -d "${jm_target_file}" ]; then
  rm -rf ${jm_target_file}
fi

jm_fn_log "正在下载项目代码"
git clone 'git@github.com:HelloCPL/jiumu-koa2-ts.git' -b ${jm_branch} "${jm_target_file}" || {
  jm_fn_build_error
  exit 1
}

# 复制数据库配置信息文件到项目，该文件信息由于比较私密不在github仓库中需另行拷贝
cp -f "${jm_base_dir}/secret/secret.ts" "${jm_tmp_dir}/${jm_target_file}/src/config/secret.ts"

cd "${jm_target_file}"

# 3. 下载项目依赖包
jm_fn_log "正在下载项目依赖"
yarn install || {
  jm_fn_build_error
  exit 1
}

# 4. 打包项目
jm_fn_log "正在打包项目"
npm run build || {
  jm_fn_build_error
  exit 1
}

if [ -d "${jm_tmp_dir}/${jm_target_file}/dist" ]; then
  # 5. 停止并删除旧的服务实例
  jm_fn_log "pm2 停止并删除旧的服务实例"
  pm2 stop "${jm_pm2_name}" && pm2 delete "${jm_pm2_name}" || true

  jm_fn_log "正在删除旧项目"
  cd ${jm_base_dir}
  if [ -d "${jm_target_file}" ]; then
    rm -rf ${jm_target_file}
  fi

  # 6. 复制项目新代码到指定存放目录
  jm_fn_log "正在复制项目新代码到指定存放目录"
  mkdir -p "${jm_base_dir}/${jm_target_file}"
  mv -vf ${jm_tmp_dir}/${jm_target_file}/{.*,}* "${jm_base_dir}/${jm_target_file}/"

  cd "${jm_base_dir}/${jm_target_file}" || {
    jm_fn_build_error
    exit 1
  }

  # 7. 备份构建记录
  jm_fn_log "正在备份构建记录"
  mkdir -p "${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}"
  cp -r . "${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}" --parents --exclude='node_modules' --exclude='.git'

  # 8. 启动新服务实例，构建完成
  jm_fn_log "正在启动新服务实例"
  pm2 start ./dist/app.js --name ${jm_pm2_name} -- ${jm_myenv}
  jm_fn_build_success
else
  jm_fn_build_error
fi

# koa服务正式环境打包特点
# 每次都全面更新整个项目代码并重新安装依赖，构建时间教长
# 全面更新，完全同步最新代码
# 先打包，后停止原有服务，对原有服务时间影响较短

# 以下为正式环境构建逻辑
# 1. 定义相关变量及引入公共函数
# 2. 进入临时存放目录并下载代码仓库
# 复制私密配置文件到项目目录
# 3. 下载项目依赖
# 4. 打包项目
# 5. 停止并删除旧的服务实例
# 6. 复制项目新代码到指定存放目录
# 7. 备份构建记录
# 8. 启动新服务实例，构建完成
