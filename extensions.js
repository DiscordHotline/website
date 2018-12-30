String.prototype.truncate = function(n, useWordBoundary = true) {
    if (this.length <= n) {
        return this;
    }

    let subString = this.substr(0, n - 1);

    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + "...";
};

String.prototype.ucfirst  = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
String.prototype.trimChar = function(char) {
    let newString = this;
    while (this.charAt(0) === char) {
        newString = newString.substring(1);
    }

    while (this.charAt(newString.length - 1) === char) {
        newString = newString.substring(0, newString.length - 1);
    }

    return newString;
};

Array.prototype.contains  = function(...items) {
    for (let item of items) {
        if (this.indexOf(item) >= 0) {
            return true;
        }
    }

    return false;
};
String.prototype.contains = function(...items) {
    for (let item of items) {
        if (this.indexOf(item) >= 0) {
            return true;
        }
    }

    return false;
};
