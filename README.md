# HTML Programming Language

People often make fun of HTML for not being a real programming language.

This is no longer the case.

## Sample programs

### Sum of natural numbers

```html
<!-- Sum of the first N numbers -->
<var name="sum">0</var>
<var name="n"><input/></var>

<form value="n">
    <!-- Increment the sum by n -->
    <var name="sum">
        <math>
            <var name="sum"/>
            +
            <var name="n"/>
        </math>
    </var>

    <!-- Decrement n by 1 -->
    <var name="n">
        <math>
            <var name="n"/>
            - 1
        </math>
    </var>
</form>

<output>
    <var name="sum"/>
</output>
```

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

Var is an expression that can also be used to return the current variable value by omitting child nodes:

```html
<var name="myVariable">
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

### Loops

This is how you write a "for-m" loop that runs 3 times: 
```html
<var name="myVariable">3</var>
<form value="myVariable">
    <var name="myVariable">
        <math>
            <var name="myVariable"/>
            - 1
        </math>
    </var>
</form>
```

### Input / Output

Read value from standard input:

```html
<var name="myVariable"><input /></var>
```

Print value to standard output:

```html
<var name="myVariable">1</var>
<output>
    <var name="myVariable" />
</output>
```
