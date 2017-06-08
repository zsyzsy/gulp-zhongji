/**
 * Created by yhsl on 2017/6/8.
 */

//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp');

//postcss
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');  //Autoprefixer(处理浏览器私有前缀)
var cssgrace  = require('cssgrace');
var cssnext  = require('cssnext');  //cssnext(使用CSS未来的语法)

//插件
var minifyCss = require("gulp-minify-css");  //css文件压缩
var uglify=require("gulp-uglify");  //js文件压缩
var jshint = require('gulp-jshint');//用来检查js代码
var map = require( 'map-stream' );  //检测js语法的错误自定义
var imagemin = require('gulp-imagemin');   //压缩图片文件
var pngquant = require('imagemin-pngquant'); //png图片压缩插件

//公用插件
var concat = require('gulp-concat');//文件合并
var rename = require('gulp-rename'); //设置压缩后的文件名
var notify = require('gulp-notify');//提示信息
var livereload = require('gulp-livereload'); //自动刷新


//然后将插件添加到processors数组中
gulp.task('post-css', function () {
    var processors = [
        autoprefixer({browsers: ['last 3 version'],
            cascade: false,
            remove: false
        }),
        cssnext(),
        autoprefixer(),
        cssgrace
    ];
    return gulp.src('./src/css/*.css')   //该任务针对的文件
        .pipe(postcss(processors))  //该任务调用的模块
        .pipe(gulp.dest('./dist/css'))   //dist/css下生成新文件夹
        .pipe(livereload());   //自动刷新
});

//合并css且压缩css文件   执行了post-css  再执行minify-css
gulp.task('minify-css', ['post-css'],function () {
    gulp.src('./dist/css/*.css') // css文件内的所有css
        .pipe(concat('all.css'))  //合并css
        .pipe(gulp.dest('dist/css')) //合并后存放的路径
        .pipe(minifyCss()) //压缩css
        .pipe(rename({suffix:'.min'})) //设置压缩后的文件名
        .pipe(gulp.dest('./dist'))   //压缩后存放的位置
        .pipe(livereload())  //自动刷新
        .pipe(notify({ message: 'css task ok' }));  //提示成功信息
});

//js合并
gulp.task('minify-js', function () {
    gulp.src('./src/js/*.js')  //要合并的文件
        .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js"
        .pipe(gulp.dest('dist/js')) //合并后存放的路径
        .pipe(uglify())  //使用uglify进行压缩,更多配置请参考：
        .pipe(rename({suffix:'.min'})) //设置压缩后的文件名
        .pipe(gulp.dest('dist/js')) //压缩后存放的路径
        .pipe(livereload())  //自动刷新
        .pipe(notify({ message: 'js task ok' }));  //提示成功信息
});

//js检测语法的错误提示
// gulp.task('jsLint', function () {
//     gulp.src('./dist/js/*.js')  //检查文件：js目录下所有的js文件
//         .pipe(jshint())  //进行检查
//         .pipe(jshint.reporter('default')); // 对代码进行报错提示
// });

//检测语法的错误自定义
/* file.jshint.success = true; // or false 代码检查是否成功
 file.jshint.errorCount = 0; // 错误的数量
 file.jshint.results = []; // 错误的结果集
 file.jshint.data = []; // JSHint returns details about implied globals, cyclomatic complexity, etc
 file.jshint.opt = {}; // The options you passed to JSHint
 */
var myReporter = map(function (file, cb) {
    if (!file.jshint.success) {
        console.log('[ '+file.jshint.errorCount+' errors in ]'+file.path);
        file.jshint.results.forEach(function (err) {
            /*
             err.line 错误所在的行号
             err.col  错误所在的列号
             err.message/err.reason 错误信息
             */
            if (err) {
                console.log(' '+file.path + ': line ' + err.line + ', col ' + err.character + ', code ' + err.code + ', ' + err.reason);
            }
        });
    }
    cb(null, file);
});
gulp.task('jshint',function() {
    return gulp.src('./dist/js/*.js')  // dist/js/目录下所有的js文件
        .pipe(jshint())     // js代码检查
        .pipe(myReporter);  // 若有错误，则调用myReporter进行提示
});
//j检测语法的错误自定义end

//图片压缩
// gulp.task('default', function () {
//     return gulp.src('./src/images/*')
//         .pipe(imagemin({
//             progressive: true,
//             use: [pngquant()] //使用pngquant来压缩png图片
//         }))
//         .pipe(gulp.dest('./dist'));
// });

// 压缩图片
gulp.task('testImagemin', function () {
    gulp.src('./src/images/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true,//类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('./dist/images'))  //压缩后存放的位置
        .pipe(livereload());  //自动刷新
});

//监听文件是否有变化
gulp.task('watch', function(){
    gulp.watch('./src/css/*.css', ['post-css']);  //监听./src/css是否有变化
    gulp.watch('./dist/css/*.css', ['minify-css']); //监听./dist/css是否有变化
    gulp.watch('./src/js/*.js', ['minify-js']); //监听./src/js是否有变化
});

//执行

gulp.task('default', ['watch','minify-css','minify-js','jshint','testImagemin']);  //运行gulp