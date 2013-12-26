var markit = require('markit');
var unhtml = require('unhtml');
var colors = require('ansicolors');
var styles = require('ansistyles');
var config = require('./config');

var TOKEN_REGEX = /\{\{(.*?)\}\}/g;

var COLORS = config.colors;
COLORS['command-background'] = bgColor(COLORS['command-background']);

var allElements = [
  'blockcode', 'blockhtml', 'blockquote', 'codespan', 'emphasis',
  'header', 'hrule', 'image', 'linebreak', 'link', 'list', 'listitem',
  'paragraph', 'strikethrough', 'strong', 'table', 'tablecell', 'tablerow'];


exports.fromMarkdown = function(markdown) {

  var r = new markit.Renderer();

  // ignore all syntax by default
  allElements.forEach(function(e) {
    r[e] = function() { return ''; }
  });

  // paragraphs just pass through (automatically created by new lines)
  r.paragraph = function(text) {
    return text;
  };

  //
  // High-level description
  //

  r.blockquote = function(text) {
    text = text.replace('\n', '\n  ')
    return '  ' + styles.italic(text);
  };

  //
  // Examples
  //

  r.list = function(body, ordered) {
    return '\n\n' + body + '\n';
  }
  
  r.listitem = function(text) {
    return colors[COLORS['list']]('  - ' + text) + '\n';
  };

  r.codespan = function(code, lang) {
    var highlighted = code.replace(TOKEN_REGEX, highlightToken);
    return '    ' + colors[COLORS['command-background']](colors[COLORS['command']](highlighted)) + '';
  };

  return '\n' + unhtml(markit(markdown, {renderer: r})) + '\n';

};

function highlightToken(match, capture) {
  return colors.open[COLORS['command-token']] + capture + colors.open[COLORS['command']];
}

function bgColor(name) {
  return 'bg' + name[0].toUpperCase() + name.substring(1);
}
