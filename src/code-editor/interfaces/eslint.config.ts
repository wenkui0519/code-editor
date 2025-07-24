// jslint
export const ESLINT_CONFIG = {
    // 在构造函数中禁止在 super() 之前调用 this
    'constructor-super': 2,
    // 强制 for 循环更新计数器朝着正确的方向移动
    'for-direction': 2,
    // 强制 getter 函数中有返回值
    'getter-return': 2,
    // 禁止使用异步函数作为 Promise 执行器
    'no-async-promise-executor': 2,
    // 禁止在 case 或 default 子句中出现词法声明
    'no-case-declarations': 2,
    // 禁止将类的名称赋值给变量
    'no-class-assign': 2,
    // 禁止比较时使用 NaN
    'no-compare-neg-zero': 2,
    // 禁止条件语句中出现赋值操作符
    'no-cond-assign': 2,
    // 禁止修改 const 声明的变量
    'no-const-assign': 2,
    // 禁止在条件中使用常量表达式
    'no-constant-condition': 2,
    // 禁止在正则表达式中使用控制字符
    'no-control-regex': 2,
    // 禁用 debugger
    'no-debugger': 2,
    // 禁止删除变量
    'no-delete-var': 2,
    // 禁止 function 参数出现重名
    'no-dupe-args': 2,
    // 禁止类成员中出现重复的名称
    'no-dupe-class-members': 1,
    // 禁止 if else if 语句中出现重复的条件
    'no-dupe-else-if': 2,
    // 禁止对象字面量中出现重复的 key
    'no-dupe-keys': 1,
    // 禁止在 switch 语句中出现重复的 case
    'no-duplicate-case': 2,
    // 禁止空块语句
    'no-empty': 2,
    // 禁止在正则表达式中使用空字符集
    'no-empty-character-class': 2,
    // 禁止空的解构模式
    'no-empty-pattern': 2,
    // 禁止对原生对象或只读的全局对象进行赋值
    'no-global-assign': 2,
    // 禁止使用 eval()
    // 'no-eval': 2,
    // 禁止在正则表达式中使用无效的正则表达式
    'no-invalid-regexp': 2,
    // 禁止在字符串中使用不规范的空白符
    // 'no-irregular-whitespace': 2,
    // 禁止 Symbol() 前使用 new 操作符
    'no-new-symbol': 2,
    // 禁止使用 Function 构造函数进行对象创建
    'no-implied-eval': 2,
    // 禁止在全局范围内使用 this 关键字
    'no-invalid-this': 2,
    // 禁止使用 __iterator__ 属性
    'no-iterator': 2,
    // 禁止在循环中出现 function 声明和表达式
    'no-loop-func': 2,
    // 禁用多个空格
    'no-multi-spaces': 2,
    // 禁止使用多行字符串
    'no-multi-str': 2,
    // 禁止对原生对象赋值
    'no-native-reassign': 2,
    // 禁止使用 Function 构造函数进行对象创建
    'no-new-func': 2,
    // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-new-wrappers': 2,
    // 禁止对 arguments 对象赋值
    'no-param-reassign': 2,
    // 禁用 __proto__ 属性
    'no-proto': 2,
    // 禁止重新声明变量
    'no-redeclare': 2,
    // 禁止在正则表达式中使用空格
    'no-regex-spaces': 2,
    // 禁止在 return 语句中使用赋值语句
    'no-return-assign': 2,
    // 禁止将变量初始化为 undefined
    'no-undef-init': 2,
    // 禁止在循环条件中使用常量表达式
    'no-unmodified-loop-condition': 2,
    // 禁止在 return、throw、continue 和 break 语句后出现不可达代码
    'no-unreachable': 2,
    // 禁止在 finally 语句块中出现控制流语句
    'no-unsafe-finally': 2,
    // 禁止对关系运算符的左操作数使用否定操作符
    'no-unsafe-negation': 2,
    // 禁止不被使用的标签
    'no-unused-labels': 1,
    // 禁止声明变量却不使用
    'no-unused-vars': 1,
    // 禁止在正则表达式中出现不必要的转义符
    'no-useless-escape': 2,
    // 禁止使用 with 语句
    'no-with': 2,
    // 要求使用 isNaN() 检查 NaN
    'use-isnan': 2,
    // 强制 typeof 表达式与有效的字符串字面量或有效的变量一起比较
    'valid-typeof': 2,
    // 禁止在全局作用域下定义变量或函数
    'no-implicit-globals': 2,
    // 禁止在循环中出现 await
    'no-await-in-loop': 2,
    // 禁止在 return 语句中使用 await
    'no-return-await': 2,
    // 禁止在数组中出现连续的逗号
    'no-sparse-arrays': 2,
    // 禁止在 super() 前使用 this/super
    'no-this-before-super': 2,
};
// formulaLint
export const FORMULA_LINT_CONFIG = {
    // 在构造函数中禁止在 super() 之前调用 this
    'constructor-super': 0,
    // 强制 for 循环更新计数器朝着正确的方向移动
    'for-direction': 0,
    // 强制 getter 函数中有返回值
    'getter-return': 0,
    // 禁止使用异步函数作为 Promise 执行器
    'no-async-promise-executor': 0,
    // 禁止在 case 或 default 子句中出现词法声明
    'no-case-declarations': 0,
    // 禁止将类的名称赋值给变量
    'no-class-assign': 0,
    // 禁止比较时使用 NaN
    'no-compare-neg-zero': 0,
    // 禁止条件语句中出现赋值操作符
    'no-cond-assign': 0,
    // 禁止修改 const 声明的变量
    'no-const-assign': 0,
    // 禁止在条件中使用常量表达式
    'no-constant-condition': 0,
    // 禁止在正则表达式中使用控制字符
    'no-control-regex': 0,
    // 禁用 debugger
    'no-debugger': 0,
    // 禁止删除变量
    'no-delete-var': 0,
    // 禁止 function 参数出现重名
    'no-dupe-args': 0,
    // 禁止类成员中出现重复的名称
    'no-dupe-class-members': 0,
    // 禁止 if else if 语句中出现重复的条件
    'no-dupe-else-if': 2,
    // 禁止对象字面量中出现重复的 key
    'no-dupe-keys': 0,
    // 禁止在 switch 语句中出现重复的 case
    'no-duplicate-case': 2,
    // 禁止空块语句
    'no-empty': 2,
    // 禁止在正则表达式中使用空字符集
    'no-empty-character-class': 2,
    // 禁止空的解构模式
    'no-empty-pattern': 2,
    // 禁止对原生对象或只读的全局对象进行赋值
    'no-global-assign': 0,
    // 禁止使用 eval()
    'no-eval': 2,
    // 禁止在正则表达式中使用无效的正则表达式
    'no-invalid-regexp': 2,
    // 禁止在字符串中使用不规范的空白符
    'no-irregular-whitespace': 0,
    // 禁止 Symbol() 前使用 new 操作符
    'no-new-symbol': 0,
    // 禁止使用 Function 构造函数进行对象创建
    'no-implied-eval': 2,
    // 禁止在全局范围内使用 this 关键字
    'no-invalid-this': 0,
    // 禁止使用 __iterator__ 属性
    'no-iterator': 0,
    // 禁止在循环中出现 function 声明和表达式
    'no-loop-func': 0,
    // 禁用多个空格
    'no-multi-spaces': 0,
    // 禁止使用多行字符串
    'no-multi-str': 0,
    // 禁止对原生对象赋值
    'no-native-reassign': 0,
    // 禁止使用 Function 构造函数进行对象创建
    'no-new-func': 0,
    // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-new-wrappers': 0,
    // 禁止对 arguments 对象赋值
    'no-param-reassign': 0,
    // 禁用 __proto__ 属性
    'no-proto': 0,
    // 禁止重新声明变量
    'no-redeclare': 0,
    // 禁止在正则表达式中使用空格
    'no-regex-spaces': 0,
    // 禁止在 return 语句中使用赋值语句
    'no-return-assign': 0,
    // 禁止将变量初始化为 undefined
    'no-undef-init': 0,
    // 禁止在循环条件中使用常量表达式
    'no-unmodified-loop-condition': 0,
    // 禁止在 return、throw、continue 和 break 语句后出现不可达代码
    'no-unreachable': 0,
    // 禁止在 finally 语句块中出现控制流语句
    'no-unsafe-finally': 0,
    // 禁止对关系运算符的左操作数使用否定操作符
    'no-unsafe-negation': 0,
    // 禁止不被使用的标签
    'no-unused-labels': 0,
    // 禁止声明变量却不使用
    'no-unused-vars': 0,
    // 禁止在正则表达式中出现不必要的转义符
    'no-useless-escape': 0,
    // 禁止使用 with 语句
    'no-with': 0,
    // 要求使用 isNaN() 检查 NaN
    'use-isnan': 0,
    // 强制 typeof 表达式与有效的字符串字面量或有效的变量一起比较
    'valid-typeof': 0,
    // 禁止在全局作用域下定义变量或函数
    'no-implicit-globals': 0,
    // 禁止在循环中出现 await
    'no-await-in-loop': 0,
    // 禁止在 return 语句中使用 await
    'no-return-await': 0,
    // 禁止在数组中出现连续的逗号
    'no-sparse-arrays': 0,
    // 禁止在 super() 前使用 this/super
    'no-this-before-super': 0,
    // 禁止使用 `javascript:` url
    'no-script-url': 2,
    // 不允许对只读的全局变量进行赋值
    'no-undef': 0,
    // 预期的是赋值或函数调用，而实际看到的是表达式
    'no-unused-expressions': 0,
    // 不允许在三元表达式的操作数之间加换行
    'multiline-ternary': 0,
    // 不允许三元表达式
    'no-ternary': 0,
    // 构造函数名称以大写字母开头
    'new-cap': 0,
    // 不允许括号内有空格
    'space-in-parens': 0,
    // 规则限制了括号的使用，只在有必要的地方使用
    'no-extra-parens': 0,
    // 强制要求在函数调用的参数之间进行换行
    'function-call-argument-newline': 0,
    // 确保特殊数字 被声明为常量，使其含义明确
    'no-magic-numbers': 0,
    // 变量声明、数组字面、对象字面、函数参数和序列中逗号前后的间距一致
    'comma-spacing': 0,
    // 强制要求统一使用反斜线、双引号或单引号
    'quotes': 0,
    // 要求在非空文件的末尾至少有一个换行（或没有换行）的末尾至少有一个换行
    'eol-last': 0,
    // 关键词间距上执行一致性
    'keyword-spacing': 0,
    // 使块内的空行填充一致
    'padded-blocks': 0,
    // 强制执行区块前的间距的一致性
    'space-before-blocks': 0,
    // 强制执行一致的缩进风格
    'indent': 0,
    // 强制执行一致的缩进风格
    'indent-legacy': 0,
    // // 
    'block-spacing': 0,
    // 在消除脚本顶层或其他区块内不必要的、可能引起混淆的区块
    'no-lone-blocks': 0,
    // 强制要求在对象和数组字面上统一使用尾随逗号
    'comma-dangle': 0,
};
// 错误多语言
export const ERROR_LABEL = {
    'warning': 'eui.code_editor.warning',
    'error': 'eui.code_editor.error',
    'constructor-super': 'eui.code_editor.constructor_super',
    'for-direction': 'eui.code_editor.for_direction',
    'getter-return': 'eui.code_editor.getter_return',
    'no-async-promise-executor': 'eui.code_editor.no_async_promise_executor',
    'no-case-declarations': 'eui.code_editor.no_case_declarations',
    'no-class-assign': 'eui.code_editor.no_class_assign',
    'no-compare-neg-zero': 'eui.code_editor.no_compare_neg_zero',
    'no-cond-assign': 'eui.code_editor.no_cond_assign',
    'no-const-assign': 'eui.code_editor.no_const_assign',
    'no-constant-condition': 'eui.code_editor.no_constant_condition',
    'no-control-regex': 'eui.code_editor.no_control_regex',
    'no-debugger': 'eui.code_editor.no_debugger',
    'no-delete-var': 'eui.code_editor.no_delete_var',
    'no-dupe-args': 'eui.code_editor.no_dupe_args',
    'no-dupe-class-members': 'eui.code_editor.no_dupe_class_members',
    'no-dupe-else-if': 'eui.code_editor.no_dupe_else_if',
    'no-dupe-keys': 'eui.code_editor.no_dupe_keys',
    'no-duplicate-case': 'eui.code_editor.no_duplicate_case',
    'no-empty': 'eui.code_editor.no_empty',
    'no-empty-character-class': 'eui.code_editor.no_empty_character_class',
    'no-empty-pattern': 'eui.code_editor.no_empty_pattern',
    'no-global-assign': 'eui.code_editor.no_global_assign',
    'no-invalid-regexp': 'eui.code_editor.no_invalid_regexp',
    'no-new-symbol': 'eui.code_editor.no_new_symbol',
    'no-implied-eval': 'eui.code_editor.no_implied_eval',
    'no-invalid-this': 'eui.code_editor.no_invalid_this',
    'no-iterator': 'eui.code_editor.no_iterator',
    'no-loop-func': 'eui.code_editor.no_loop_func',
    'no-multi-spaces': 'eui.code_editor.no_multi_spaces',
    'no-multi-str': 'eui.code_editor.no_multi_str',
    'no-native-reassign': 'eui.code_editor.no_native_reassign',
    'no-new-func': 'eui.code_editor.no_new_func',
    'no-new-wrappers': 'eui.code_editor.no_new_wrappers',
    'no-param-reassign': 'eui.code_editor.no_param_reassign',
    'no-proto': 'eui.code_editor.no_proto',
    'no-redeclare': 'eui.code_editor.no_redeclare',
    'no-regex-spaces': 'eui.code_editor.no_regex_spaces',
    'no-return-assign': 'eui.code_editor.no_return_assign',
    'no-undef-init': 'eui.code_editor.no_undef_init',
    'no-unmodified-loop-condition': 'eui.code_editor.no_unmodified_loop_condition',
    'no-unreachable': 'eui.code_editor.no_unreachable',
    'no-unsafe-finally': 'eui.code_editor.no_unsafe_finally',
    'no-unsafe-negation': 'eui.code_editor.no_unsafe_negation',
    'no-unused-labels': 'eui.code_editor.no_unused_labels',
    'no-unused-vars': 'eui.code_editor.no_unused_vars',
    'no-useless-escape': 'eui.code_editor.no_useless_escape',
    'no-with': 'eui.code_editor.no_with',
    'use-isnan': 'eui.code_editor.use_isnan',
    'valid-typeof': 'eui.code_editor.valid_typeof',
    'no-implicit-globals': 'eui.code_editor.no_implicit_globals',
    'no-await-in-loop': 'eui.code_editor.no_await_in_loop',
    'no-return-await': 'eui.code_editor.no_return_await',
    'no-sparse-arrays': 'eui.code_editor.no_sparse_arrays',
    'no-this-before-super': 'eui.code_editor.no_this_before_super',
    'no-script-url': '禁止使用 `javascript:` url',
};
// 过滤的错误
export const ERROR_FILTER = [
    'Parsing error: Unexpected token <',
]