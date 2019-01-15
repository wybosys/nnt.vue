const _sample = () => import("../components/sample/Sample.vue")
const _ = () => import("../components/sample/Sample.vue")
const _sample_audiorecorder = () => import("../components/sample/AudioRecorder.vue")
const _sample_echo = () => import("../components/sample/Echo.vue")
const _sample_helloworld = () => import("../components/sample/HelloWorld.vue")
const _sample_sample = () => import("../components/sample/Sample.vue")
const _test = () => import("../components/test/Test.vue")
const _test_test = () => import("../components/test/Test.vue")

export default [
	{
		path: '/sample',
		component: _sample,
		name: '_sample'
	},
	{
		path: '/',
		component: _,
		name: '_'
	},
	{
		path: '/sample/audiorecorder',
		component: _sample_audiorecorder,
		name: '_sample_audiorecorder'
	},
	{
		path: '/sample/echo',
		component: _sample_echo,
		name: '_sample_echo'
	},
	{
		path: '/sample/helloworld',
		component: _sample_helloworld,
		name: '_sample_helloworld'
	},
	{
		path: '/sample/sample',
		component: _sample_sample,
		name: '_sample_sample'
	},
	{
		path: '/test',
		component: _test,
		name: '_test'
	},
	{
		path: '/test/test',
		component: _test_test,
		name: '_test_test'
	},
	{
		path: '/framework/nntvue/sample',
		component: _sample,
		name: 'devops_sample'
	},
	{
		path: '/framework/nntvue/',
		component: _,
		name: 'devops_'
	},
	{
		path: '/framework/nntvue/sample/audiorecorder',
		component: _sample_audiorecorder,
		name: 'devops_sample_audiorecorder'
	},
	{
		path: '/framework/nntvue/sample/echo',
		component: _sample_echo,
		name: 'devops_sample_echo'
	},
	{
		path: '/framework/nntvue/sample/helloworld',
		component: _sample_helloworld,
		name: 'devops_sample_helloworld'
	},
	{
		path: '/framework/nntvue/sample/sample',
		component: _sample_sample,
		name: 'devops_sample_sample'
	},
	{
		path: '/framework/nntvue/test',
		component: _test,
		name: 'devops_test'
	},
	{
		path: '/framework/nntvue/test/test',
		component: _test_test,
		name: 'devops_test_test'
	}
]
