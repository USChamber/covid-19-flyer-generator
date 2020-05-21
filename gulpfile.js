const { src, dest, watch, series } = require("gulp");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const cacheBreak = require("gulp-cache-break");
const replace = require("gulp-replace-path");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const del = require("del");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("autoprefixer");
const precss = require("precss");
const colorFunction = require("postcss-color-function");

// configure file structure

const basepath = "dist";
const styles = ["src/scss/style.scss"];
const stylesForWatching = ["src/scss/*.scss", "config/*.scss"];
const javascripts = ["src/js/*.js"];

const htmls = ["src/*.html"];
const imgs = ["src/img/*", "src/img/**/*"];

function compileSass() {
  const plugins = [
    precss(),
    colorFunction({ preserveCustomProps: true }),
    autoprefixer(),
  ];
  return src(styles)
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.css"))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write("."))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(basepath + "/css"));
}

// not sure how to implement this conditionally
function commentCss() {
  return src(styles)
    .pipe(replace("/* START:COMMENT_OUT */", "/*"))
    .pipe(replace("/* END:COMMENT_OUT */", "*/"));
}

function scripts() {
  return src(javascripts)
    .pipe(concat("bundle.js"))
    .pipe(
      babel({
        presets: ["babel-preset-env"],
      })
    )
    .pipe(dest(basepath + "/js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(basepath + "/js"));
}

function copyHtml() {
  return src(htmls, { base: "./src" })
    .pipe(replace(/<!--BEGIN:COMMENT_OUT-->/g, "<!--"))
    .pipe(replace(/<!--END:COMMENT_OUT-->/g, "-->"))
    .pipe(dest(basepath));
}

function copyImgs() {
  return src(imgs).pipe(dest(basepath + "/img/"));
}

function cacheBuster() {
  return src(["dist/index.html"])
    .pipe(
      cacheBreak({
        match: ["vendor.js", "bundle.min.js", "bundle.min.css", "bundle.js"],
      })
    )
    .pipe(dest("dist"));
}

function initiateWatch(done) {
  browserSync.init({
    server: "./dist/",
  });

  watch(stylesForWatching, compileSass).on("change", browserSync.reload);
  watch(javascripts, scripts).on("change", browserSync.reload);
  watch(htmls, copyHtml).on("change", browserSync.reload);
  watch(imgs, copyImgs).on("change", browserSync.reload);
  done();
}

async function clean(cb) {
  await del.sync([basepath]);
  cb();
}

exports.watch = series(
  clean,
  compileSass,
  scripts,
  copyHtml,
  copyImgs,
  cacheBuster,
  initiateWatch
);
exports.build = series(
  clean,
  compileSass,
  scripts,
  copyHtml,
  copyImgs,
  cacheBuster
);

exports.clean = clean;
