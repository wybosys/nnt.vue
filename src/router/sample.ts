const _audiorecorder = () => import("../components/AudioRecorder.vue")
const _echo = () => import("../components/Echo.vue")
const _helloworld = () => import("../components/HelloWorld.vue")
const _sample = () => import("../components/Sample.vue")

export default [
	{
		path: '/audiorecorder',
		component: _audiorecorder,
		name: '_audiorecorder'
	},
	{
		path: '/echo',
		component: _echo,
		name: '_echo'
	},
	{
		path: '/helloworld',
		component: _helloworld,
		name: '_helloworld'
	},
	{
		path: '/sample',
		component: _sample,
		name: '_sample'
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
