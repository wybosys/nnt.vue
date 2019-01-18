const _ = () => import("../sites/test/Test.vue")
const _test = () => import("../sites/test/Test.vue")

export default [
	{
		path: '/',
		component: _,
		name: '_'
	},
	{
		path: '/test',
		component: _test,
		name: '_test'
	}
]
