let project_folder = require("path").basename(__dirname);
let source_folder = "src";
//let fs = require("fs");

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,jpeg,png,svg,gif.ico,webp}",
        fonts: source_folder + "/fonts/*.{ttf,woff,woff2}",
        svgSprite: source_folder + "/img/svgSprite",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,jpeg,png,svg,gif.ico,webp}",
    },
    clean: "./" + project_folder + "/"
}
const sass = require('gulp-sass')(require('sass'))
let {
    src,
    dest
} = require("gulp"),
    gulp = require("gulp"),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    svgSprite = require("gulp-svg-sprite"),
    ttf2wpff = require("gulp-ttf2woff"),
    ttf2wpff2 = require("gulp-ttf2woff2"),
    fonter = require("gulp-fonter");

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            sass()
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade: true,
                grid: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css({
            level: {
                1: {
                    specialComments: 0
                }
            }
        }))
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2wpff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2wpff2())
        .pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', function () {
    return src([source_folder + "/fonts/*.otf"])
        .pipe(fonter({
            format: ['ttf']
        }))
        .pipe(dest(source_folder + "/fonts/"));
})


gulp.task('svgSprite', function () {
    return gulp.src([source_folder + "/iconsprite/*.svg"])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg", // sprite name
                    //example: true
                }
            },
        }))
        .pipe(dest(path.src.svgSprite))
})



/*function fontsStyle(params) {
    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }

}*/


function watchFiles() {
    gulp.watch([path.watch.html], html).on('change', browsersync.reload);
    gulp.watch([path.watch.css], css).on('change', browsersync.reload);
    gulp.watch([path.watch.js], js).on('change', browsersync.reload);
    gulp.watch([path.watch.img]).on('change', browsersync.reload);
}

function clean() {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, fonts)/*, fontsStyle*/);
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.fonts = fonts;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;