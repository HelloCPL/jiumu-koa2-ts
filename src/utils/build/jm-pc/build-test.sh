#!/bin/bash

# 测试环境打包特点
# 每次只更新项目新的代码，整个构建时间较短
# 遵循 git pull 更新原则，极端情况下可能出现新代码不同步情况
# 发布时间较短

# 以下为测试环境构建逻辑
# 1. 定义相关变量与函数
# 2. 进入指定暂存存放目录（不会删除）
  # 2.1 若已存在代码仓库，则直接更新代码
  # 2.2 若不存在，则下载代码仓库
  # 2.3 复制私密配置信息文件到项目，该文件信息由于比较私密不在github仓库中需另行拷贝
# 3. 下载项目依赖包
# 4. 打包
# 5. 替换资源
# 6. 备份构建记录，构建完成

# 1. 定义相关变量与函数
# 指定发布环境
jm_myenv=test
# 基础项目服务目录路径
jm_base_dir=/data/front/jiumu-pc
# 项目打包记录存放目录路径
jm_back_dir=/data/backups/jiumu-pc
# 项目记录存放时间
jm_back_dir_time=$(date "+%Y-%m-%d-%H-%M")
# 项目目录路径
jm_target_dir=/usr/local/nginx/html
# 项目目录名称
jm_target_file=jiumu-pc-${jm_myenv}


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
  git clone git@github.com:HelloCPL/jiumu.git -b test ${jm_target_file}
  cd ${jm_target_file}
fi

if [ -d "${jm_base_dir}/${jm_target_file}" ]; then
  # 复制私密配置信息文件到项目，该文件信息由于比较私密不在github仓库中需另行拷贝
  mkdir -p ${jm_base_dir}/${jm_target_file}/config
  cp -f ${jm_base_dir}/secret/secret.ts ${jm_base_dir}/${jm_target_file}/config/secret.ts
  # 3. 下载项目依赖包
  echo "正在下载项目依赖包..."
  pnpm i
  # 4. 打包
  echo "正在打包项目..."
  increase-memory-limit
  pnpm run pc:test

  if [ -d "${jm_base_dir}/${jm_target_file}/packages/pc/dist" ];then
    # 5. 替换资源
    echo "正在更新资源..."
    if [ -d "${jm_target_dir}/${jm_target_file}" ];then
      rm -rf ${jm_target_dir}/${jm_target_file}
    fi
    mkdir -p  ${jm_target_dir}/${jm_target_file}
    cd ${jm_base_dir}/${jm_target_file}/packages/pc/dist
    cp -r `ls | grep -v node_modules|xargs` ${jm_target_dir}/${jm_target_file}
    # 6. 备份构建记录
    echo "正在备份构建记录..."
    mkdir -p ${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}
    cd ${jm_base_dir}/${jm_target_file}/packages/pc/dist
    cp -r `ls | grep -v node_modules|xargs` ${jm_back_dir}/${jm_target_file}/${jm_back_dir_time}
    echo "项目启动成功!"
    jm_fn_build_success
  else
    jm_fn_build_error
  fi
else
  jm_fn_build_error
fi