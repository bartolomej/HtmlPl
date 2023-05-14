# HTML Programming Language

People make fun of HTML not being a real programming language.

This changes now. Introducing HtmlPl, a HTML Programming Language.

## Guide

### Declaring a variable

Here is how you declare a variable named "myVariable", with an initial value of `["1", "2"]`.

```html
<var name="myVariable">
    <ul>
        <li>1</li>
        <li>2</li>
    </ul>
</var>
```

### Conditional logic

You can use the select-option expression to perform conditional logic.
This is similar to the switch-case statement in other languages.

```html
<var name="myVariable">1</var>
<var name="myCalculatedVariable">
    <select value="myVariable">
        <option value="0">It's false</option>
        <option value="1">It's true</option>
    </select>
</var>
```

### Input / Output

Read value from standard input:

```html
<var name="myVariable"><input /></var>
```

Print value to standard output:

```html
<var name="myVariable">1</var>
<output value="myVariable"/>
```
