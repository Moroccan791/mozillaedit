// AV Edit Bridge - startup test 3: wait for app, then create project.
(function () {
    var log = "E:/ai-video-editor/premiere/build_result.txt";
    var L = [];
    function w(s) { L.push(String(s)); }
    try {
        w("t=" + new Date().toString());
        w("version=" + app.version);
        w("before sleep: project=" + (app.project ? app.project.name : "null"));
        $.sleep(15000);
        w("after 15s sleep: project=" + (app.project ? app.project.name : "null"));

        var projDir = "E:/ai-video-editor/premiere";
        try {
            var pr = app.newProject(projDir);
            w("newProject(folder) -> " + (pr ? "object" : "null"));
            w("project.name=" + (app.project ? app.project.name : "null"));
            w("project.path=" + (app.project ? app.project.path : "null"));
        } catch (e1) {
            w("newProject err: " + e1.toString() + " line=" + e1.line);
        }
        w("DONE");
    } catch (e) {
        w("FATAL: " + e.toString() + " line=" + e.line);
    }
    var f = new File(log);
    f.encoding = "UTF-8";
    if (f.open("w")) { f.write(L.join("\n")); f.close(); }
})();
