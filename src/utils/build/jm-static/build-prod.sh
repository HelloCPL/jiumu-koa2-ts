#!/bin/bash

# 测试环境静态资源托管服务打包特点
# 每次都全面更新整个项目代码并重新安装依赖，构建时间教长
# 全面更新，完全同步最新代码
# 先停止原有服务，后更新代码，对原有服务时间影响较长

# 以下为正式环境构建逻辑
# 1. 定义相关变量
# 2. 进入临时存放目录下载全新项目代码
# 3. 停止原有项目服务，并删除原有项目代码
# 4. 复制项目新代码到指定存放目录
# 5. 启动项目服务，构建完成

# 1. 定义相关变量
# 指定发布环境
myenv=prod
# 指定服务端口号
myport=7302
# 基础项目服务目录路径
base_dir=/data/front/jiumu-static
# 临时存放项目路径
tmp_dir=/tmp/source
# 项目目录名称
target_file=jiumu-static-${myenv}
# pm2 运行名称
pm2_name=jiumu-static-${myenv}

echo "****************** 开始构建 ${target_file} 项目 ***********************"
# 2. 进入临时存放目录下载全新项目代码
cd ${tmp_dir}
if [ -d "${target_file}" ];then
  rm -rf ${target_file}
fi
echo "正在下载项目代码..."
git clone git@github.com:HelloCPL/jiumu-static.git -b main ${target_file}
if [ -d "${target_file}" ];then
  # 3. 停止原有项目服务，并删除原有项目代码
  echo "正在停止原有项目服务..."
  pm2 stop ${pm2_name}
  pm2 delete ${pm2_name}
  echo "正在将原有项目删除..."
  cd ${base_dir}
  if  [ -d "${target_file}" ];then
    rm -rf ${target_file}
  fi
  # 4. 复制项目新代码到指定存放目录
  echo "正在复制项目新代码..."
  mkdir -p ${base_dir}/${target_file}
  mv -vf ${tmp_dir}/${target_file}/* ${base_dir}/${target_file}/
  cd ${base_dir}/${target_file}
  # 5. 启动项目服务，构建完成
  echo "正在启动项目服务..."
  pm2 start "http-server ./ -p ${myport} --cors --gzip true -d false" --name ${pm2_name}
  echo "项目启动成功!"
else
  echo "******************* 构建 ${target_file} 项目失败 ***********************"
fi
