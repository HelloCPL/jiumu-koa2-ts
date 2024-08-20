#!/bin/bash

# 测试环境打包特点
# 每次只更新项目新的代码，整个构建时间较短
# 遵循 git pull 更新原则，极端情况下可能出现新代码不同步情况
# 由于打包在停止原有服务前，对原有服务时间影响较长

# 以下为测试环境构建逻辑
# 1. 定义相关变量
# 2. 进入指定项目存放目录
#   2.1 若已存在代码仓库，则直接更新代码
#   2.2 若不存在，则下载代码仓库
# 3. 下载项目依赖包
# 4. 停止原有项目服务
# 5. 打包
# 6. 备份构建记录
# 7. 启动项目服务，构建完成

# 1. 定义相关变量
jm_myenv=test # 指定发布环境
jm_base_dir=/data/front/jiumu-koa2-ts # 基础项目服务目录路径
jm_back_dir=/data/backups/jiumu-koa2-ts # 项目打包记录存放目录路径
jm_back_dir_time=$(date "+%Y-%m-%d-%H-%M") # 项目记录存放时间
jm_target_file=jiumu-koa2-ts-${jm_myenv} # 项目目录名称
jm_pm2_name=jiumu-koa2-ts-${jm_myenv} # pm2 运行名称
jm_start_time=$(date +%s) # 项目开始运行时间，单位 s

# 日志打印函数
jm_fn_log() {
  local jm_log_time=$(date '%Y-%m-%d %H:%M:$S')
  echo "[${jm_log_time}] $@"
}

# 开始构建
jm_fn_build_start() {
  jm_build_date=$(date "+%Y-%m-%d %H:%M:%S")
  echo "****************** 开始构建 ${jm_target_file} 项目 ${jm_build_date} ***********************"
}

# 构建成功
jm_fn_build_success() {
  jm_build_date=$(date "+%Y-%m-%d %H:%M:%S")
  echo "******************* 构建 ${jm_target_file} 项目成功 ${jm_build_date} ************************"
}

# 构建失败
jm_fn_build_error() {
  jm_build_date=$(date "+%Y-%m-%d %H:%M:%S")
  echo "******************* 构建 ${jm_target_file} 项目失败 ${jm_build_date} ***********************" 
}

jm_fn_build_start

# 2. 进入指定项目存放目录
cd ${jm_base_dir}
if [ -d "${jm_target_file}" ];then
  # 2.1 若已存在代码仓库，则直接更新代码
  echo "正在更新项目代码..."
  cd ${jm_target_file}
  git pull origin test
else
  # 2.2 若不存在，则下载代码仓库
  echo "正在下载项目代码..."
  git clone git@github.com:HelloCPL/jiumu-koa2-ts.git -b test ${jm_target_file}
  cd ${jm_target_file}
fi

if [ -d "${jm_base_dir}/${jm_target_file}" ]; then
  # 复制数据库配置信息文件到项目，该文件信息由于比较私密不在github仓库中需另行拷贝
  cp -f ${jm_base_dir}/secret/secret.ts ${jm_base_dir}/${jm_target_file}/src/config/secret.ts
  # 3. 下载项目依赖包
  echo "正在下载项目依赖包..."
  yarn
  # 4. 停止原有项目服务
  echo "正在停止原有项目服务..."
  pm2 stop ${jm_pm2_name}
  pm2 delete ${jm_pm2_name}
  # 5. 打包
  echo "正在打包项目..."
  rm -rf ${jm_base_dir}/${jm_target_file}/dist
  npm run build

  if [ -d "${jm_base_dir}/${jm_target_file}/dist" ];then
    # 6. 备份构建记录
    echo "正在备份构建记录..."
    mkdir -p ${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}
    cd ${jm_base_dir}/${jm_target_file}
    cp -r `ls | grep -v node_modules|xargs` ${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}
    # 7. 启动项目服务，构建完成
    echo "正在启动项目服务..."
    pm2 start ./dist/app.js --name ${jm_pm2_name} -- ${jm_myenv}
    echo "项目启动成功!"
    jm_fn_build_success
  else
    jm_fn_build_error
  fi
else
  jm_fn_build_error
fi
