#!/bin/bash

# 测试环境静态资源托管服务打包特点
# 每次只更新项目新的代码，整个构建时间较短
# 遵循 git pull 更新原则，极端情况下可能出现新代码不同步情况
# 先更新代码，后停止原有服务，对原有服务时间影响较短

# 以下为测试环境构建逻辑
# 1. 定义相关变量
# 2. 进入指定项目存放目录
  # 2.1 若已存在代码仓库，则直接更新代码
  # 2.2 若不存在，则下载代码仓库
# 3. 停止原有项目服务
# 4. 启动项目服务，构建完成

# 1. 定义相关变量
# 指定发布环境
myenv=test
# 指定服务端口号
myport=7301
# 基础项目服务目录路径
base_dir=/data/front/jiumu-static
# 项目目录名称
target_file=jiumu-static-${myenv}
# pm2 运行名称
pm2_name=jiumu-static-${myenv}

echo "****************** 开始构建 ${target_file} 项目 ***********************"
# 2. 进入指定项目存放目录
cd ${base_dir}
if [ -d "${target_file}" ];then
  # 2.1 若已存在代码仓库，则直接更新代码
  echo "正在更新项目代码..."
  cd ${target_file}
  git pull origin test
else
  # 2.2 若不存在，则下载代码仓库
  echo "正在下载项目代码..."
  git clone git@github.com:HelloCPL/jiumu-static.git -b test ${target_file}
  cd ${target_file}
fi
if [ -d "${base_dir}/${target_file}" ]; then
  # 3. 停止原有项目服务
  echo "正在停止原有项目服务..."
  pm2 stop ${pm2_name}
  pm2 delete ${pm2_name}
  # 4. 启动项目服务，构建完成
  echo "正在启动项目服务..."
  pm2 start "http-server ./ -p ${myport} --cors --gzip true -d false" --name ${pm2_name}
  echo "项目启动成功!"
else
  echo "******************* 构建 ${target_file} 项目失败 ***********************"
fi
