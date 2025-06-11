# Description

## Github Flavored Markdown

Motion uses [Github Flavored Markdown](https://github.github.com/gfm/) for all of the description fields.

API users can test their code using a markdown to HTML converter, like [showdown](https://www.npmjs.com/package/showdown).

## Limitations

Currently, we use Prosemirror for our text editor, and it does not seem to play nicely with Github Flavored Markdown.

Specifically, creating a checkbox with `- [ ] My checkbox` or `- [x] My checkbox` does not work.

We are in the process of ripping out Prosemirror, and in a couple weeks this limitation should be solved. Until then, please use the following workaround.

Use the following raw HTML string in the description input to create a checkbox:

```html
<ul data-type="taskList">
  <li data-checked="false">
    <label contenteditable="false">
      <input type="checkbox"><span></span>
    </label>
    <div>
      <p>YOUR SUBTASK ITEM HERE</p>
    </div>
  </li>
</ul>
```