// AV Edit Bridge - probe
// Runs from Premiere's Scripts\Startup folder at launch.
// Writes a result file so the brain can verify scripting works.
(function () {
    var logPath = "E:/ai-video-editor/premiere/probe_result.txt";
    var out = [];
    try {
        out.push("appName=" + app.appName);
        out.push("version=" + app.version);
        out.push("build=" + app.build);
        out.push("project=" + (app.project ? app.project.name : "null"));
        out.push("projectPath=" + (app.project && app.project.path ? app.project.path : "null"));
        out.push("ok=true");
    } catch (e) {
        out.push("error=" + e.toString());
        out.push("line=" + e.line);
        out.push("ok=false");
    }
    var f = new File(logPath);
    f.encoding = "UTF-8";
    if (f.open("w")) {
        f.write(out.join("\n"));
        f.close();
    }
})();
