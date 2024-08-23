#!/bin/bash

# 日志打印函数
jm_fn_log() {
  local jm_log_time=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[${jm_log_time}] $1"
}

# 格式化总用时
jm_fn_format_total_time() {
  local jm_duration=$1
  if [ $jm_duration -gt 60 ]; then
    echo "$((jm_duration / 60)) 分 $((jm_duration % 60)) 秒"
  else
    echo "${jm_duration} 秒"
  fi
}

# 构建成功函数
jm_fn_build_success() {
  local jm_end_time=$(date +%s)
  local jm_duration=$((jm_end_time - jm_start_time))
  jm_fn_log "构建 ${jm_target_file} 项目成功!!! 总用时 $(jm_fn_format_total_time $jm_duration)"
}

# 构建失败函数
jm_fn_build_error() {
  local jm_end_time=$(date +%s)
  local jm_duration=$((jm_end_time - jm_start_time))
  jm_fn_log "构建 ${jm_target_file} 项目失败!!! 总用时 $(jm_fn_format_total_time $jm_duration)"
}
