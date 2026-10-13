// AV Edit Bridge - startup builder test
// Tries: create project -> import media -> create sequence -> insert clip.
(function () {
    var log = "E:/ai-video-editor/premiere/build_result.txt";
    var L = [];
    function w(s) { try { L.push(String(s)); } catch (e) {} }
    try {
        w("startup builder running");
        w("version=" + app.version);

        // 1) ensure a project exists
        var projDir = "E:/ai-video-editor/premiere";
        if (!app.project || !app.project.name) {
            var pr = app.newProject(projDir);
            w("newProject -> " + (pr ? "object" : "null"));
        }
        w("project.name=" + app.project.name);
        w("project.path=" + app.project.path);

        // 2) import media
        var media = "E:/ai-video-editor/projects/football/raw/match.mp4";
        var imported = app.project.importFiles([media], true, app.project.rootItem, false);
        w("importFiles=" + imported);
        w("root children=" + app.project.rootItem.children.numItems);
        var item = app.project.rootItem.children[0];
        w("item0.name=" + (item ? item.name : "null"));

        // 3) create a sequence from the clip
        var seq = null;
        try {
            seq = app.project.createNewSequenceFromClips("aive_seq", [item], app.project.rootItem);
            w("createNewSequenceFromClips -> " + (seq ? seq.name : "null"));
        } catch (e1) {
            w("seqFromClips err: " + e1.toString() + " line=" + e1.line);
        }
        if (!seq) {
            try {
                seq = app.project.createNewSequence("aive_seq2", "");
                w("createNewSequence -> " + (seq ? seq.name : "null"));
            } catch (e2) {
                w("createNewSequence err: " + e2.toString() + " line=" + e2.line);
            }
        }

        // 4) insert clip at 0s
        if (seq) {
            w("videoTracks=" + seq.videoTracks.numTracks);
            var track = seq.videoTracks[0];
            var okIns = track.insertClip(item, 0);
            w("insertClip=" + okIns);
            w("clips on track0=" + track.clips.numItems);
            if (track.clips.numItems > 0) {
                w("clip0 start=" + track.clips[0].start.seconds + " end=" + track.clips[0].end.seconds);
            }
        }
        w("DONE ok=true");
    } catch (e) {
        w("FATAL: " + e.toString() + " line=" + e.line);
    }
    var f = new File(log);
    f.encoding = "UTF-8";
    if (f.open("w")) { f.write(L.join("\n")); f.close(); }
})();
