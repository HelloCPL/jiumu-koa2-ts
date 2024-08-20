#!/bin/bash

# 正式环境打包特点
# 每次都全面更新整个项目代码并重新安装依赖，构建时间教长
# 全面更新，完全同步最新代码
# 先打包，后停止原有服务，对原有服务时间影响较短

# 以下为正式环境构建逻辑
# 1. 定义相关变量
# 2. 进入临时存放目录下载全新项目代码，并复制项目数据库等私密配置信息文件
# 3. 下载项目依赖包
# 4. 打包
# 5. 停止原有项目服务，并删除原有项目代码
# 6. 复制项目新代码到指定存放目录
# 7. 备份构建记录
# 8. 启动项目服务，构建完成

# 1. 定义相关变量
# 指定发布环境
jm_myenv=prod
# 基础项目目录路径
jm_base_dir=/data/front/jiumu-koa2-ts
# 项目记录存放目录路径
jm_back_dir=/data/backups/jiumu-koa2-ts
# 项目记录存放时间
jm_back_dir_time=$(date "+%Y-%m-%d-%H-%M")
# 临时存放项目路径
jm_tmp_dir=/tmp/source
# 项目目录名称
jm_target_file=jiumu-koa2-ts-${jm_myenv}
# pm2 运行名称
jm_pm2_name=jiumu-koa2-ts-${jm_myenv}

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

# 2. 进入临时存放目录下载全新项目代码，并复制项目数据库等私密配置信息文件
cd ${jm_tmp_dir}
if [ -d "${jm_target_file}" ];then
  rm -rf ${jm_target_file}
fi
echo "正在下载项目代码..."
git clone git@github.com:HelloCPL/jiumu-koa2-ts.git -b main ${jm_target_file}

if [ -d "${jm_target_file}" ];then
  cd ${jm_target_file}
  # 复制数据库配置信息文件到项目，该文件信息由于比较私密不在github仓库中需另行拷贝
  cp -f ${jm_base_dir}/secret/secret.ts ${jm_tmp_dir}/${jm_target_file}/src/config/secret.ts
  # 3. 下载项目依赖包
  echo "正在下载项目依赖包..."
  yarn
  # 4. 打包
  echo "正在打包项目..."
  npm run build

  if [ -d "${jm_tmp_dir}/${jm_target_file}/dist" ];then
    # 5. 停止原有项目服务，并删除原有项目代码
    echo "正在停止原有项目服务..."
    pm2 stop ${jm_pm2_name}
    pm2 delete ${jm_pm2_name}
    echo "正在将原有项目删除..."
    cd ${jm_base_dir}
    if  [ -d "${jm_target_file}" ];then
      rm -rf ${jm_target_file}
    fi
    # 6. 复制项目新代码到指定存放目录
    echo "正在复制项目新代码..."
    mkdir -p ${jm_base_dir}/${jm_target_file}
    mv -vf ${jm_tmp_dir}/${jm_target_file}/* ${jm_base_dir}/${jm_target_file}/
    # 7. 备份构建记录
    echo "正在备份构建记录..."
    mkdir -p ${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}
    cd ${jm_base_dir}/${jm_target_file}
    cp -r `ls | grep -v node_modules|xargs` ${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}
    # 8. 启动项目服务，构建完成
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
