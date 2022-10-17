function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function loadout(loadoutNum) {
  // code to select loadout
  if (loadoutNum === 1) {
    cfg_loadout = loadout_one;
  } else if (loadoutNum === 2) {
    cfg_loadout = loadout_two;
  } else {
    cfg_loadout = loadout_three;
  }
  // end of select loadout

  $(".select-characters-button > button ").click();
  await sleep(1500);
  $(".character-selector .character").each(function () {
    const orcNumber = $(this)
      .find(".MuiListItemText-primary")
      .text()
      .replace(/\D/g, "");
    const orcLevel =
      parseInt(
        $(this).find(".MuiListItemText-secondary").text().replace(/\D/g, "")
      ) - ($(this).hasClass("disabled") ? 100000 : 0);
    let race = "orc";
    if (orcNumber > 5050) race = "shaman";
    if (orcNumber > 8050) race = "ogre";
    if (orcNumber > 11050) race = "rogue";
    if (orcNumber > 14050) race = "mage";

    if (!$(this).hasClass("race_" + race)) $(this).addClass("race_" + race);
    $(this).attr("data-sort", orcLevel);
    $(this).attr("data-id", orcNumber);
  });
  /*
	$(".character-selector-inner .character").sort(function (a, b) {
		const contentA = parseInt( $(a).data('sort'));
		const contentB = parseInt( $(b).data('sort'));
		return (contentA > contentB) ? -1 : (contentA > contentB) ? 1 : 0;
	}).appendTo(".character-selector-inner");
	*/

  let cfg = cfg_loadout.solo;
  if (
    $(".character-select-wrapper button[aria-pressed='true']").attr("value") ==
    "party"
  ) {
    cfg = cfg_loadout.party;
  }

  for (let i = 0; i < cfg.length; i++) {
    let cfgitem = cfg[i];

    if (cfgitem.id < 1) continue;

    $(
      ".character-selector-inner .character[data-id='" +
        cfgitem.id +
        "'] button"
    ).click();

    $(".character-overview .item-slot").eq(0).click();

    await sleep(1500);

    if (cfgitem.ar > 0)
      $(".inventory button")
        .eq(cfgitem.ar - 1)
        .click(); //AR

    $(".character-overview .item-slot").eq(1).click();

    await sleep(1000);

    if (cfgitem.mh > 0)
      $(".inventory button")
        .eq(cfgitem.mh - 1)
        .click(); //MH

    $(".character-overview .item-slot").eq(2).click();

    await sleep(1000);

    if (cfgitem.oh > 0) {
      $(".inventory button")
        .eq(cfgitem.oh - 1)
        .click(); //OH
      await sleep(500);
    }
  }

  $(".character-selector-inner").prepend(
    $(".character-selector-inner .character.selected")
  );
} //end of loadout function

$(document).ready(function () {
  $(document).on("click", ".charSelFilter a", function () {
    const filterRace = $(this).attr("id").replace("filter_", "");
    if (filterRace == "all") {
      $(".character-selector .character").show();
    } else {
      $(".character-selector .character").hide();
      $(".character-selector .character.race_" + filterRace).show();
    }
    $(".charSelFilter a").removeClass("blumActive");
    $(this).addClass("blumActive");
  });
  $("body").append(
    '<div id="blumIcon" class="toggleBlumMenu"><img src="' +
      chrome.runtime.getURL("images/logo48.png") +
      '" /></div>'
  );
  $("body").append(`<div id="blumMenu"><ul>
	<li><a href="https://etherorcs.com/dapp">Terminal</a></li>
	<li><a href="https://dungeons.etherorcs.com/?start">Dungeons</a></li>
	<li><a href="https://etherorcs.com/town/emporium">Open Chests</a></li>
	<li><a href="https://etherorcs.com/town/crafting">Blacksmith</a></li>
	<li><a href="https://etherorcs.com/town/marketplace">Marketplace</a></li>
	<li><a class="toggleBlumMenu" href="#">[close]</a></li>
	</ul></div>`);
  $(".toggleBlumMenu").click(function (e) {
    e.preventDefault();
    $("#blumMenu").toggle();
  });

  if ($(".dungeon-crawler").length > 0) {
    $(document).on("DOMSubtreeModified", function () {
      if (
        $(".character-select-wrapper").length > 0 &&
        $("#loadout").length < 1
      ) {
        /*
        class="MuiButton-root MuiButton-text MuiButton-textPrimary MuiButton-sizeMedium MuiButton-textSizeMedium MuiButtonBase-root  css-onqdri"
        */

        // Injected changes to support multiple loadouts
        $('button:contains("SELECT CHARACTERS")').after(
          `<div id="loadout-wrapper"> 
            <div id="loadout" >Use Loadout</div>
            <div id="loadoutOne" class="loadout-options">1</div>
            <div id="loadoutTwo" class="loadout-options">2</div>
            <div id="loadoutThree" class="loadout-options">3</div>
          </div>`
        );
        // this needs to be cleaned up to a parent listener
        // and a handler depending on which child triggerd it
        $("#loadoutOne").click(function () {
          $("#loadout-wrapper").hide();
          loadout(1);
        });
        $("#loadoutTwo").click(function () {
          $("#loadout-wrapper").hide();
          loadout(2);
        });
        $("#loadoutThree").click(function () {
          $("#loadout-wrapper").hide();
          loadout(3);
        });
      }
    });
  }
});

var s = document.createElement("script");
s.src = chrome.runtime.getURL("overwrite_settimeout.js");
s.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);
