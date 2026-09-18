document.querySelectorAll('.video-preview').forEach(function (preview) {
  preview.querySelector('button').addEventListener('click', function () {
    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + preview.dataset.videoId + '?autoplay=1';
    frame.title = preview.dataset.videoTitle;
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    preview.replaceChildren(frame);
    frame.focus();
  });
});
