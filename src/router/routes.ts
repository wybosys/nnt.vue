const _sample = () => import("../components/sample/Sample.vue")
const Sample = () => import("../components/sample/Sample.vue")
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
		component: Sample,
		name: 'Sample'
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
	}
]
