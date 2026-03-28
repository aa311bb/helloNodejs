/**
 * Node.js Path 模块学习示例
 * Path模块用于处理文件和目录路径
 */

const path = require('path');

console.log('========== Node.js Path 模块示例 ==========\n');

// 1. path.join() - 拼接路径
console.log('1. path.join() - 路径拼接');
console.log('   path.join("/a", "b", "c"):', path.join('/a', 'b', 'c'));
console.log('   path.join("public", "images", "logo.png"):', path.join('public', 'images', 'logo.png'));
console.log('   path.join("/foo", "bar", "baz/asdf", "quux", ".."):', path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'));
console.log();

// 2. path.resolve() - 解析为绝对路径
console.log('2. path.resolve() - 解析为绝对路径');
console.log('   path.resolve("foo/bar", "baz"):', path.resolve('foo/bar', 'baz'));
console.log('   path.resolve("/foo", "./bar"):', path.resolve('/foo', './bar'));
console.log('   path.resolve("wwwroot", "static_files/png/", "../gif/image.gif"):',
    path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif'));
console.log();

// 3. path.basename() - 获取路径中的文件名
console.log('3. path.basename() - 获取文件名');
console.log('   path.basename("/foo/bar/baz.txt"):', path.basename('/foo/bar/baz.txt'));
console.log('   path.basename("/foo/bar/baz.txt", ".txt"):', path.basename('/foo/bar/baz.txt', '.txt'));
console.log('   path.basename("C:\\\\Users\\\\Admin\\\\file.js"):', path.basename('C:\\Users\\Admin\\file.js'));
console.log();

// 4. path.dirname() - 获取目录名
console.log('4. path.dirname() - 获取目录名');
console.log('   path.dirname("/foo/bar/baz.txt"):', path.dirname('/foo/bar/baz.txt'));
console.log('   path.dirname("/foo/bar/baz/"):', path.dirname('/foo/bar/baz/'));
console.log('   path.dirname("./app.js"):', path.dirname('./app.js'));
console.log();

// 5. path.extname() - 获取扩展名
console.log('5. path.extname() - 获取扩展名');
console.log('   path.extname("app.js"):', path.extname('app.js'));
console.log('   path.extname("index.html"):', path.extname('index.html'));
console.log('   path.extname("file.tar.gz"):', path.extname('file.tar.gz'));
console.log('   path.extname("noext"):', path.extname('noext'));
console.log();

// 6. path.parse() - 解析路径对象
console.log('6. path.parse() - 解析路径为对象');
const parsed = path.parse('/home/user/docs/file.txt');
console.log('   path.parse("/home/user/docs/file.txt"):');
console.log('   ', JSON.stringify(parsed, null, 2).replace(/\n/g, '\n    '));
console.log();

// 7. path.format() - 从对象生成路径
console.log('7. path.format() - 从对象生成路径');
const pathObj = {
    dir: '/home/user',
    base: 'file.txt'
};
console.log('   path.format({ dir: "/home/user", base: "file.txt" }):', path.format(pathObj));
console.log();

// 8. path.sep - 路径分隔符
console.log('8. path.sep - 路径分隔符');
console.log('   当前系统的路径分隔符:', JSON.stringify(path.sep));
console.log('   "foo/bar/baz".split(path.sep):', 'foo/bar/baz'.split(path.sep));
console.log();

// 9. path.delimiter - 环境变量分隔符
console.log('9. path.delimiter - 环境变量分隔符');
console.log('   当前系统的环境变量分隔符:', JSON.stringify(path.delimiter));
console.log();

// 10. path.isAbsolute() - 判断是否为绝对路径
console.log('10. path.isAbsolute() - 判断绝对路径');
console.log('    path.isAbsolute("/foo/bar"):', path.isAbsolute('/foo/bar'));
console.log('    path.isAbsolute("./foo"):', path.isAbsolute('./foo'));
console.log('    path.isAbsolute("C:\\\\Windows"):', path.isAbsolute('C:\\Windows'));
console.log();

// 11. path.normalize() - 规范化路径
console.log('11. path.normalize() - 规范化路径');
console.log('    path.normalize("/foo/bar//baz/asdf/quux/.."):', path.normalize('/foo/bar//baz/asdf/quux/..'));
console.log('    path.normalize("C:\\\\temp\\\\\\\\foo\\\\bar\\\\..\\\\"):', path.normalize('C:\\temp\\\\foo\\bar\\..\\'));
console.log();

// 12. path.relative() - 获取相对路径
console.log('12. path.relative() - 获取相对路径');
console.log('    path.relative("/data/orandea/test/aaa", "/data/orandea/impl/bbb"):');
console.log('    ', path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'));
console.log();

// 13. __dirname 和 __filename (特殊变量)
console.log('13. __dirname 和 __filename');
console.log('    __dirname (当前文件所在目录):', __dirname);
console.log('    __filename (当前文件完整路径):', __filename);
console.log();

// 14. 实用示例：构建文件路径
console.log('14. 实用示例');
const uploadsDir = path.join(__dirname, 'uploads');
const avatarPath = path.join(uploadsDir, 'avatars', 'user123.png');
console.log('    上传目录:', uploadsDir);
console.log('    头像路径:', avatarPath);
console.log('    头像所在目录:', path.dirname(avatarPath));
console.log('    头像文件名:', path.basename(avatarPath));
console.log('    头像扩展名:', path.extname(avatarPath));

console.log('\n========== 学习完成 ==========');
