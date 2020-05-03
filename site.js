var sniply = {
  ran: false,
  cta_frame: null,
  slug: "",
  init: function () {
    if (sniply.ran) {
      return;
    }
    sniply.ran = true;

    sniply.create_sniply_bar();
  },
  get_slug_from_location: function () {
    var split_path = window.location.pathname.split("/");
    var actual_split_path = [];
    for (var i = 0; i < split_path.length; i++) {
      if (split_path[i] != "") {
        actual_split_path.push(split_path[i]);
      }
    }
    if (actual_split_path.length >= 1) {
      sniply.slug = actual_split_path[actual_split_path.length - 1];
    }
  },
  cta_frame_appearance: {
    initialize: function () {
      sniply.cta_frame.style.width = "100%";
      sniply.cta_frame_appearance.hide_sniply_bar();

      sniply.cta_frame.style.display = "block";
      sniply.cta_frame.style.visibility = "visible";
      sniply.cta_frame.style.border = "0px";
      sniply.cta_frame.style.background = "rgba(0,0,0,0)";
      sniply.cta_frame.style.borderRadius = "0px";
      sniply.cta_frame.style.boxShadow = "none";
      sniply.cta_frame.style.color = "rgba(0,0,0, 1)";
      sniply.cta_frame.style.cursor = "auto";
      sniply.cta_frame.style.margin = "0px";
      sniply.cta_frame.style.lineHeight = "normal";
      sniply.cta_frame.style.maxWidth = "none";
      sniply.cta_frame.style.maxHeight = "none";
      sniply.cta_frame.style.minWidth = "0px";
      sniply.cta_frame.style.minHeight = "0px";
      sniply.cta_frame.style.outlineWidth = "0px";
      sniply.cta_frame.style.padding = "0px";
      sniply.cta_frame.style.pointerEvents = "auto";
      sniply.cta_frame.style.zIndex = "9999999999";
      sniply.cta_frame.style.zoom = "1";
    },
    hide_sniply_bar: function () {
      if (sniply.cta_frame != null) {
        sniply.cta_frame.style.position = "absolute !important";
        sniply.cta_frame.style.opacity = "0";
        sniply.cta_frame.style.left = "-99999999px";
        sniply.cta_frame.style.top = "-99999999px";
      }
    },
    show_sniply_bar: function () {
      if (sniply.cta_frame != null) {
        sniply.cta_frame.style.position = "fixed";
        sniply.cta_frame.style.opacity = "1";
        sniply.cta_frame.style.left = 0;
        sniply.cta_frame.style.top = "auto";
        sniply.cta_frame.style.bottom = 0;
        sniply.cta_frame.style.right = "auto";
      }
    },
    make_fullwidth: function () {
      sniply.cta_frame_appearance.set_width("100%");
    },
    set_width: function (width) {
      if (typeof width == "number") {
        width = width.toString() + "px";
      }
      sniply.cta_frame.style.width = width;
    },
    set_height: function (height) {
      if (typeof height == "number") {
        height = height.toString() + "px";
      }
      sniply.cta_frame.style.height = height;
    },
    position_right: function () {
      sniply.cta_frame.style.right = 0;
      sniply.cta_frame.style.left = "auto";
    },
    position_top: function () {
      sniply.cta_frame.style.top = 0;
      sniply.cta_frame.style.bottom = "auto";

      // add the pos-top class
      sniply.cta_frame.className = sniply.cta_frame.className.replace(
        "pos-top",
        ""
      );
      sniply.cta_frame.className += sniply.cta_frame.className
        ? " pos-top"
        : "pos-top";
    },
    get_window_width: function () {
      if (self.innerWidth) {
        return self.innerWidth;
      }
      if (document.documentElement && document.documentElement.clientWidth) {
        return document.documentElement.clientWidth;
      }
      if (document.body) {
        return document.body.clientWidth;
      }
    },
  },
  handle_post_messages: function (evt) {
    if (evt.data) {
      var event_data = null;
      try {
        event_data = (JSON && JSON.parse(evt.data)) || $.parseJSON(evt.data);
      } catch (e) {
        return;
      }

      if (!event_data.source || event_data.source.indexOf("sniply-bar") == -1) {
        return;
      }
      if (!event_data.status || event_data.status.indexOf("ok") == -1) {
        return;
      }
      if (!event_data.type) {
        return;
      }
      switch (event_data.type) {
        case "resize-request": {
          if (
            event_data.fullwidth_forced ||
            event_data.cta.theme == "fullwidth" ||
            event_data.width > sniply.cta_frame_appearance.get_window_width
          ) {
            sniply.cta_frame_appearance.make_fullwidth();
          } else {
            sniply.cta_frame_appearance.set_width(event_data.width);
          }
          sniply.cta_frame_appearance.set_height(event_data.height);

          sniply.cta_frame_appearance.show_sniply_bar();
          if (event_data.cta.position.indexOf("right") != -1) {
            sniply.cta_frame_appearance.position_right();
          }
          if (event_data.cta.position.indexOf("top") != -1) {
            sniply.cta_frame_appearance.position_top();
          }

          if (
            event_data.cta.theme == "fullwidth" ||
            event_data.fullwidth_forced
          ) {
            var content_frame = document.getElementById("ContentFrame");

            if (
              content_frame.style.height == undefined ||
              content_frame.style.height.length == 0
            ) {
              content_frame.style.height = "98%";
              content_frame.style.height = "calc(100% - 50px)";
              content_frame.style.height = "-webkit-calc(100% - 50px)";
              content_frame.style.height = "-moz-calc(100% - 50px)";
              content_frame.style.position = "relative";

              if (event_data.cta.position.indexOf("top") != -1) {
                content_frame.style.top = "50px";
              }
            }
          }

          break;
        }
        case "remove-frame": {
          sniply.cta_frame.style.display = "none";
          break;
        }
        case "referrer-request": {
          var message = {
            status: "ok",
            type: "referrer-notification",
            source: "sniply-parent",
            referrer: document.referrer,
          };
          sniply.cta_frame.contentWindow.postMessage(
            JSON.stringify(message),
            sniply.cta_frame.src
          );

          var message = {
            status: "ok",
            type: "is-on-sniply-notification",
            source: "sniply-parent",
            on_sniply: true,
          };
          sniply.cta_frame.contentWindow.postMessage(
            JSON.stringify(message),
            sniply.cta_frame.src
          );
          break;
        }
        default: {
          return;
        }
      }
    }
  },
  window_resize_event: function () {
    var message = {
      status: "ok",
      type: "window-resize-event",
      source: "sniply-parent",
      width: sniply.cta_frame_appearance.get_window_width(),
    };
    sniply.cta_frame.contentWindow.postMessage(
      JSON.stringify(message),
      sniply.cta_frame.src
    );
  },
  create_sniply_bar: function () {
    sniply.get_slug_from_location();
    if (sniply.slug == "") {
      return;
    }

    sniply.cta_frame = document.createElement("iframe");
    sniply.cta_frame_appearance.initialize();

    var url = "https://snip.ly" + "/render/";

    url = url.slice(0, url.length - 1);
    url = url + "/" + sniply.slug + "/";

    // add any query parameters
    if (document.location.href.length > 0) {
      // add the original url
      url = url + "?_url=" + encodeURIComponent(document.location.href);

      if (document.location.href.indexOf("?") >= 0) {
        // if the document location has query params, also add them as parameters to the url
        var query_params = document.location.href.slice(
          document.location.href.indexOf("?")
        );
        if (query_params.indexOf("#") >= 0)
          query_params = query_params.slice(0, query_params.indexOf("#"));
        if (query_params.length > 0)
          query_params = query_params.replace("?", "&");
        // NOTE: rename utm_campaign to utm_camp due to AdBlock issues w/ utm_campaign= in url
        query_params = query_params.replace("utm_campaign=", "utm_camp=");
        url = url + query_params;
      }
    }

    sniply.cta_frame.setAttribute("src", url);
    sniply.cta_frame.setAttribute("id", "sniply-bar");
    document.body.appendChild(sniply.cta_frame);

    if (window.addEventListener) {
      window.addEventListener("message", sniply.handle_post_messages, false);
      window.addEventListener("resize", sniply.window_resize_event, true);
    } else {
      window.attachEvent("onmessage", sniply.handle_post_messages);
      window.attachEvent("onresize", sniply.window_resize_event);
    }
  },

  handle_underlying_amp_page: function () {
    /* facebook/twitter iOS webview */
    if (
      navigator.userAgent.indexOf("FBSN/iPhone") > 0 ||
      navigator.userAgent.indexOf("FBDV/iPhone") > 0 ||
      navigator.userAgent.indexOf("Twitter for iPhone") > 0
    ) {
      var body_height = $("body").innerHeight();
      if (body_height >= 480) {
        $("html").css("height", "calc(100% - 108px)");
      } else {
        $("html").css("height", "calc(100% - 93px)");
      }

      $(window).scroll(function () {
        if ($(window).scrollTop() < 0) {
          window.scrollTo(0, 0);
        }
      });
    }
  },
};

document.addEventListener("DOMContentLoaded", sniply.init);

window.setTimeout(function () {
  if (!sniply.ran) {
    sniply.init();
  }
}, 2000);
