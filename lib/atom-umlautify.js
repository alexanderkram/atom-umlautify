'use babel';

import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-umlautify:encode': () => this.converter('encode'),
      'atom-umlautify:decode': () => this.converter('decode')
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  converter(action) {
    const specialEntities = [
      ['&lt;', '<'],
      ['&gt;', '>'],
      ['&quot;', '"'],
      ['&apos;', '\'']
    ];
    let editor;
    let entities;
    let Entities;
    let getText;
    let slectedText;

    editor = atom.workspace.getActiveTextEditor();

    if (typeof editor === 'undefined') {
      return;
    }

    if (typeof Entities === 'undefined') {
      Entities = require('html-entities').AllHtmlEntities;
    }

    entities = new Entities();
    selectedText = editor.getSelectedText();
    getText = editor.getText();

    if (selectedText && action === 'decode') {
      return editor.insertText(entities.decode(selectedText));
    } else if (selectedText) {
      return editor.insertText(this.textEncode(entities.encode(selectedText), specialEntities));
    } else if (action === 'decode') {
      return editor.setText(entities.decode(getText));
    } else {
      return editor.setText(this.textEncode(entities.encode(getText), specialEntities));
    }
  },

  textEncode(text, arr) {
    for (let i = 0; i < arr.length; i++) {
      let n = 0;
      do {
        n++;
        text = text.replace(arr[i][0], arr[i][1]);
      } while (n < text.length);
    }
    return text;
  }
};
