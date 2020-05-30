'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const mqpacker = require('css-mqpacker');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const uglifyjs = require('gulp-uglifyjs');
const del = require('del');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const webp = require('gulp-webp');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const smartgrid = require('smart-grid');
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const rigger = require('gulp-rigger');
const gcmq = require('gulp-group-css-media-queries');
const babel = require('gulp-babel');


const isDev = (process.argv.indexOf('--dev') != -1);

function styles() {
  return gulp.src('./src/sass/**/style.scss')
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['> 0.1%'],
      cascade: false
    }))
    .pipe(postcss([
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gcmq())
    .pipe(gulp.dest('./build/css'))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
}

function scripts(jsfiles){
  return gulp.src(['./src/js/jquery-ui.min.js', './src/js/slick.min.js', './src/js/index.js'])
    // .pipe(rigger())
    .pipe(babel())
    .pipe(concat('index.js'))
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(uglifyjs())
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
}

// function scripts() {
//   return gulp.src('./src/js/*.js')
//     .pipe(gulp.dest('./build/js'))
//     .pipe(browserSync.stream());
// }

function clean() {
  return del('build/*')
}

function images() {
  return gulp.src("src/images/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/images"));
}

function svgimages() {
  return gulp.src("src/images/icon-*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/images"));
}

function copy() {
  return gulp.src("src/fonts/**/*.{woff,woff2}")
    .pipe(gulp.dest("build/fonts"));
}

function webpimages() {
  return gulp.src('src/images/**/*.{png,jpg}')
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest("build/images"));
}

function html() {
  return gulp.src('./src/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("./build"))
    .pipe(browserSync.stream());

}

function php() {
  return gulp.src('./src/*.php')
    .pipe(gulp.dest("./build"));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    },
    // tunnel: true,
    open: false
  });

  gulp.watch('./src/sass/**/*.scss', styles);
  gulp.watch('./src/js/**/*.js', scripts);
  gulp.watch('./src/*.html', html);
}

function grid(done) {

  let settings = {
    outputStyle: 'scss',
    columns: 12,
    offset: "30px",
    //mobileFirst: true,
    container: {
      maxWidth: "1170px",
      fields: "15px"
    },
    breakPoints: {
      lg: {
        width: "962px",
        fields: "15px"
      },
      md: {
        width: "738px",
        fields: "15px"
      },
      sm: {
        width: "546px",
        fields: "15px"
      }
    }
  };

  smartgrid('./src/sass', settings);
  done();
}

gulp.task('grid', grid);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('images', images);
gulp.task('svgimages', svgimages);
gulp.task('webpimages', webpimages);
gulp.task('html', html);
gulp.task('php', php);


gulp.task('build', gulp.series(clean,
  gulp.parallel(styles, scripts, svgimages, images, copy), html, php));

gulp.task('dev', gulp.series('build', 'watch'))
