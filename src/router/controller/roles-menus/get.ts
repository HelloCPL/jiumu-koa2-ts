/**
 * @description 获取角色-菜单关联数据
 * @author chen
 * @update 2021-08-07 15:15:08
 */

import { Success } from '../../../utils/http-exception'
import { execTrans, query } from '../../../db'
import { Context, Next } from 'koa'
import _ from 'lodash'
import {
	MenuOptions,
	MenuListOptions,
	MenuReturnOptions
} from '../menus/interface'
import { RoleReturnOptions } from '../roles/interface'
import {
	RoleMenuByRoleIdParams,
	RoleMenuByMenuIdParams,
	RoleMenuByRoleIdReturn,
	RoleMenuByUserIdParams
} from './interface'
import { UserListReturn, UserOptions } from '../users/interface'
import { getFileById } from '../files-info/get'

// 获取指定角色关联的所有菜单
export const doRoleMenugetAllMenuByRoleId = async (
	ctx: Context,
	next: Next
) => {
	const data = await getAllMenuByRoleId(
		{
			roleId: ctx._params.roleId,
			pageNo: ctx._params.pageNo * 1 || 1,
			pageSize: ctx._params.pageSize * 1 || 10
		},
		ctx._params.isTree
	)
	throw new Success(data)
}

// 获取指定菜单关联的所有角色
export const doRoleMenuGetAllRoleByMenuId = async (
	ctx: Context,
	next: Next
) => {
	const data = await getAllRoleByMenuId({
		menuId: ctx._params.menuId,
		pageNo: ctx._params.pageNo * 1 || 1,
		pageSize: ctx._params.pageSize * 1 || 10
	})
	throw new Success(data)
}

// 获取指定用户关联的所有菜单
export const doRoleMenugetAllMenuByUserId = async (
	ctx: Context,
	next: Next
) => {
	const data = await getAllMenuByUserId(
		{
			userId: ctx._params.userId,
			pageNo: ctx._params.pageNo * 1 || 1,
			pageSize: ctx._params.pageSize * 1 || 10
		},
		ctx._params.isTree == '1'
	)
	throw new Success(data)
}

// 获取指定菜单关联的所有用户
export const doRoleMenuGetAllUserByMenuId = async (
	ctx: Context,
	next: Next
) => {
	const data = await getAllUserByMenuId({
		menuId: ctx._params.menuId,
		pageNo: ctx._params.pageNo * 1 || 1,
		pageSize: ctx._params.pageSize * 1 || 10,
		simple: ctx._params.simple || '1'
	})
	throw new Success(data)
}

/**
 * 根据 roleId 获取所有关联的菜单列表，返回数组或[]
 * 参数 isTree 菜单是否为树结构
 */
export const getAllMenuByRoleId = async (
	options: RoleMenuByRoleIdParams,
	isTree?: boolean
): Promise<MenuReturnOptions | RoleMenuByRoleIdReturn> => {
	if (isTree) {
		const sql = `SELECT (SELECT t2.id FROM roles_menus t2 WHERE t2.menu_id = t1.id AND t2.role_id = ?) AS checked, t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.configurable, t1.label, t1.sort, t1.create_time, t1.update_time, t1.remarks FROM menus t1 LEFT JOIN menus t2 ON t1.parent_code = t2.code WHERE 1=1 ORDER BY t1.sort`
		const res = <MenuOptions[]>await query(sql, options.roleId)
		const menuData = await getTree(res)
		return {
			total: 0,
			data: menuData
		}
	} else {
		options.pageNo = options.pageNo || 1
		options.pageSize = options.pageSize || 10
		const pageNo = (options.pageNo - 1) * options.pageSize
		const sql1 = `SELECT COUNT(t1.id) AS total FROM roles_menus t1 WHERE t1.role_id = ?`
		const sql2 = `SELECT t1.id As relevance_id, t2.id, t2.parent_code, t3.label AS parent_label, t2.code, t2.label, t2.sort, t2.configurable, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM roles_menus t1 LEFT JOIN menus t2 ON t1.menu_id = t2.id LEFT JOIN menus t3 ON t2.parent_code = t3.code WHERE t1.role_id = ? ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?`
		const res: any = await execTrans([
			{ sql: sql1, data: [options.roleId] },
			{ sql: sql2, data: [options.roleId, pageNo, options.pageSize] }
		])
		return {
			total: res[0][0]['total'],
			data: res[1]
		}
	}
}

/**
 * 根据 menuId 获取所有关联的角色列表，返回数组或[]
 */
export const getAllRoleByMenuId = async (
	options: RoleMenuByMenuIdParams
): Promise<RoleReturnOptions> => {
	options.pageNo = options.pageNo || 1
	options.pageSize = options.pageSize || 10
	const pageNo = (options.pageNo - 1) * options.pageSize
	const sql1 = `SELECT COUNT(t1.id) AS total FROM roles_menus t1 WHERE t1.menu_id = ?`
	const sql2 = `SELECT t1.id As relevance_id, t2.id, t2.code, t2.label, t2.sort, t2.configurable, t2.create_time, t2.update_time, t2.terminal, t2.remarks FROM roles_menus t1 LEFT JOIN roles t2 ON t1.role_id = t2.id WHERE t1.menu_id = ? ORDER BY t2.sort, t2.update_time DESC LIMIT ?, ?`
	const res: any = await execTrans([
		{ sql: sql1, data: [options.menuId] },
		{ sql: sql2, data: [options.menuId, pageNo, options.pageSize] }
	])

	return {
		total: res[0][0]['total'],
		data: res[1]
	}
}

/**
 * 根据 userId 获取所有关联的菜单列表，返回数组或[]
 * 参数 isTree 菜单是否为树结构
 */
export const getAllMenuByUserId = async (
	options: RoleMenuByUserIdParams,
	isTree?: boolean
): Promise<MenuReturnOptions | RoleMenuByRoleIdReturn> => {
	if (isTree) {
		const sql = `SELECT (SELECT COUNT(t2.id) FROM roles_menus t2 WHERE t2.menu_id = t1.id AND t2.role_id IN (SELECT t3.role_id FROM users_roles t3 WHERE t3.user_id = ?)) AS checked, t1.id, t1.parent_code, t2.label AS parent_label, t1.code, t1.label, t1.sort, t1.configurable, t1.create_time, t1.update_time, t1.remarks FROM menus t1 LEFT JOIN menus t2 ON t1.parent_code = t2.code WHERE 1=1 ORDER BY t1.sort`
		const res = <MenuOptions[]>await query(sql, options.userId)
		const menuData = await getTree(res)
		return {
			total: 0,
			data: menuData
		}
	} else {
		options.pageNo = options.pageNo || 1
		options.pageSize = options.pageSize || 10
		const pageNo = (options.pageNo - 1) * options.pageSize
		const sql1 = `SELECT COUNT(t1.id) AS total FROM roles_menus t1 WHERE t1.role_id IN (SELECT t2.role_id FROM users_roles t2 WHERE t2.user_id = ?) GROUP BY t1.menu_id`
		const sql2 = `SELECT t3.id, t3.parent_code, t4.label AS parent_label, t3.code, t3.label, t3.sort, t3.configurable, t3.create_time, t3.update_time, t3.terminal, t3.remarks FROM roles_menus t1 LEFT JOIN menus t3 ON t1.menu_id = t3.id LEFT JOIN menus t4 ON t3.parent_code = t4.code WHERE  t1.role_id IN (SELECT t2.role_id FROM users_roles t2 WHERE t2.user_id = ?) GROUP BY t1.menu_id ORDER BY t3.sort, t3.update_time DESC LIMIT ?, ?`
		const res: any = await execTrans([
			{ sql: sql1, data: [options.userId] },
			{ sql: sql2, data: [options.userId, pageNo, options.pageSize] }
		])
		return {
			total: res[0].length,
			data: res[1]
		}
	}
}

/**
 * 根据 menuId 获取所有关联的用户列表，返回数组或[]
 */
export const getAllUserByMenuId = async (
	options: RoleMenuByMenuIdParams
): Promise<UserListReturn> => {
	options.pageNo = options.pageNo || 1
	options.pageSize = options.pageSize || 10
	const pageNo = (options.pageNo - 1) * options.pageSize
	const sql1 = `SELECT COUNT(t1.id) AS total FROM users_roles t1 WHERE t1.role_id IN (SELECT t2.role_id FROM roles_menus t2 WHERE t2.menu_id = ?) GROUP BY t1.user_id`
	let sql2: string
	if (options.simple === '1') {
		sql2 = `SELECT t3.id, t3.phone, t3.username, t3.create_time, t3.update_time, t3.terminal FROM users_roles t1 LEFT JOIN users t3 ON t1.user_id = t3.id WHERE t1.role_id IN (SELECT t2.role_id FROM roles_menus t2 WHERE t2.menu_id = ?) GROUP BY t1.user_id ORDER BY t3.update_time DESC LIMIT ?, ?`
	} else {
		sql2 = `SELECT t3.id, t3.phone, t3.username, t3.sex, t4.label as sex_label, t3.birthday, t3.avatar, t3.professional, t3.address, t3.create_time, t3.update_time, t3.terminal, t3.remarks FROM users_roles t1 LEFT JOIN users t3 ON t1.user_id = t3.id LEFT JOIN tags t4 ON t3.sex = t4.code WHERE t1.role_id IN (SELECT t2.role_id FROM roles_menus t2 WHERE t2.menu_id = ?) GROUP BY t1.user_id ORDER BY t3.update_time DESC LIMIT ?, ?`
	}
	const res: any = await execTrans([
		{ sql: sql1, data: [options.menuId] },
		{ sql: sql2, data: [options.menuId, pageNo, options.pageSize] }
	])
	let userData = <UserOptions[]>res[1]
	if (options.simple !== '1')
		for (let i = 0, len = userData.length; i < len; i++) {
			userData[i]['avatar'] = await getFileById(
				userData[i]['avatar'],
				userData[i]['id']
			)
		}
	return {
		total: res[0].length,
		data: userData
	}
}

// 处理菜单树结构层级问题
function getTree(menus: MenuOptions[]): MenuListOptions[] | any {
	// 处理一级菜单
	let originData: MenuListOptions[] = <MenuListOptions[]>menus.map((item) => {
		return {
			...item,
			checked: item.checked ? '1' : '0',
			parent_code: item.parent_code || '',
			children: []
		}
	})
	// originData.sort((a, b) => a.sort - b.sort)
	// 判断自身或子级是否有选中
	const isValid = (code: string): boolean => {
		let flag = false
		// @ts-ignore
		originData.find((item) => {
			if (item.code === code && item.checked === '1') {
				flag = true
				return true
			} else if (item.parent_code === code) {
				flag = isValid(item.code)
			}
		})
		return flag
	}
	// 递归生成树结构
	const _getTree = (pCode: string) => {
		let data: MenuListOptions[] = []
		for (let i = 0; i < originData.length; i++) {
			if (originData[i].parent_code === pCode) {
				if (isValid(originData[i].code)) {
					let obj = originData.splice(i, 1)[0]
					i--
					obj.children = _getTree(obj.code)
					// delete obj.checked
					data.push(obj)
				}
			}
		}
		return data
	}
	return _getTree('')
}
