/*
FUTURE: Do I want to save the 'navbar' settings as well? I think not. I'd rather have a default: shown for big screens, hidden for mobile.
*/

const THEME_KEY = 'nms-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
const THEME_TOGGLER_ID = 'theme_toggler';

let waitForElement = function(id,callback) {
    let element = window.document.getElementById(id);
    if (element) {
        setTimeout(function() {callback(element);}, 0);
    } else {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.getElementById(id);
            if (element) {
              callback(element);
              obs.disconnect();
              return;
            }
          });
    
        observer.observe(document, {
            childList: true,
            subtree: true
        });      
    } 

}

let loadSetting = function(key) {
    // look in session storage first, that way we can have two tabs open with the same document that might have different themes.
    let result = sessionStorage.getItem(key);
    if (result) {
        console.debug("loaded from sessionStorage",key,result);
    } else {
        result = localStorage.getItem(key);
        if (result) {
            console.debug("loaded from localstorage",key,result);
            // Save to session storage so we get this one back again on reload, instead
            // of having it overwritten by another tab.
            sessionStorage.setItem(key,result);
            console.debug("saved to sessionStorage",key,result);
        } else {
            console.debug("no value in settings",key);
        }
    }
    return result;
}

let saveSetting = function(key,theme) {
    // set both in session and local storage. That way 1) there's a personalized fallback if the session isn't set yet, and 2) new tabs will always revert to the last setting.
    // at least, that's the theory.
    sessionStorage.setItem(key,theme);
    localStorage.setItem(key,theme);
    console.debug("saved to session- and localStorage",key,theme);
};

waitForElement(THEME_TOGGLER_ID,function(toggler) {
    let theme = loadSetting(THEME_KEY);

    if (theme) {
        switch (theme) {
            case LIGHT_THEME: 
                toggler.checked = false;
                break;
            case DARK_THEME:
            default:
                toggler.checked = true;
        }
    } else {
        // ignore, just leave the default from the page.
    }
    toggler.addEventListener('change',function(event) {
        if (event.currentTarget.checked) {
            saveSetting(THEME_KEY,DARK_THEME);
        } else {
            saveSetting(THEME_KEY,LIGHT_THEME);
        }
    })
});