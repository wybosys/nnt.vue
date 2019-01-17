const _ = () => import("../sites/sample/Sample.vue")
const _audiorecorder = () => import("../sites/sample/AudioRecorder.vue")
const _echo = () => import("../sites/sample/Echo.vue")
const _helloworld = () => import("../sites/sample/HelloWorld.vue")
const _sample = () => import("../sites/sample/Sample.vue")

export default [
	{
		path: '/sample/',
		component: _,
		name: '_'
	},
	{
		path: '/sample/audiorecorder',
		component: _audiorecorder,
		name: '_audiorecorder'
	},
	{
		path: '/sample/echo',
		component: _echo,
		name: '_echo'
	},
	{
		path: '/sample/helloworld',
		component: _helloworld,
		name: '_helloworld'
	},
	{
		path: '/sample/sample',
		component: _sample,
		name: '_sample'
	},
	{
		path: '/framework/nntvue/',
		component: _,
		name: 'devops_'
	},
	{
		path: '/framework/nntvue/audiorecorder',
		component: _audiorecorder,
		name: 'devops_audiorecorder'
	},
	{
		path: '/framework/nntvue/echo',
		component: _echo,
		name: 'devops_echo'
	},
	{
		path: '/framework/nntvue/helloworld',
		component: _helloworld,
		name: 'devops_helloworld'
	},
	{
		path: '/framework/nntvue/sample',
		component: _sample,
		name: 'devops_sample'
	}
]
