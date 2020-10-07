Quill supports a number of formats, both in UI controls and API calls.

By default all formats are enabled and allowed to exist within a Quill editor and can be configured with the [formats](./configuration.md#formats) option. This is separate from adding a control in the [Toolbar](https://js.devexpress.com/Documentation/ApiReference/UI_Widgets/dxHtmlEditor/Configuration/toolbar/). For example, you can configure Quill to allow bolded content to be pasted into an editor that has no bold button in the toolbar.

#### Inline

  - Background Color - `background`
  - Bold - `bold`
  - Color - `color`
  - Font - `font`
  - Inline Code - `code`
  - Italic - `italic`
  - Link - `link`
  - Size - `size`
  - Strikethrough - `strike`
  - Superscript/Subscript - `script`
  - Underline - `underline`

#### Block

  - Blockquote - `blockquote`
  - Header - `header`
  - Indent - `indent`
  - List - `list`
  - Text Alignment - `align`
  - Text Direction - `direction`
  - Code Block - `code-block`

#### Embeds

  - Formula - `formula` (requires [KaTex](https://khan.github.io/KaTeX/))
  - Image - `image`
  - Video - `video`
