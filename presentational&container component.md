翻译自： [presentational and container component](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) &copy;翻译仅供学习使用，版权归原作者所有。

在写react应用的时候，我发现有一种非常不错的模式。如果你写过react应用你可能已经发现它了。[这片文章](https://medium.com/@learnreact/container-components-c0e67432e005)对此做了很好的解释，但是我想补充几点。

如果将组件分为两类，您会发现组件将更易于重复使用以及这么做的理由。我称之为容器组件和展示组件。但我也听说过胖组件（_Fat_）和瘦组件（_Skinny_)，聪明组件(_Smart_)和笨组件(_Dumb_)， 状态组件（_Stateful_)和纯组件(_Pure_)，荧屏(_Screens_)和组件(_Components_)等等。这些并非完全相同，但其核心思想是相似的。     

###### 我的展示组件（**presentational components**）
- 关注事物外观。
- 可能在内部包含展示组件和容器组件，并且通常有一些自己的DOM标签和自己的样式。
- 通常通过 _this.props.children_ 控制
- 不依赖于应用程序的其余部分，例如 _Flux actions_ 或 _store_。
- 不指定数据的加载方式或改变方式。
- 仅通过 _pros_ 接收数据( _data_ )和回调( _callbacks_ )。
- 很少有他们自己的状态（有的话也是UI状态而不是数据）。
- 被编写为纯函数组件([_functional components_](https://reactjs.org/blog/2015/10/07/react-v0.14.html#stateless-functional-components))，除非它们需要 （_state_）状态 ，生命周期钩子或性能优化。
- 例如：页面，边栏，陈述，用户信息，列表。

###### 我的容器组件（**container components**）
- 关心事物如何运作。
- 可以在内部包含展示组件和容器组件，但通常没有自己的任何DOM标签，除了一些div外包含标签，并且从不具有任何样式。
- 向展示组件或其他容器组件提供数据和行为。
- 调用Flux actions并将其作为回调提供给展示组件。
- 通常是有状态的，因为它们往往被用来充当数据源。
- 通常使用高阶组件(_HOC_)例如React Redux中的 _connect()_，Relay中的 _createContainer()_，或是Flux Utils中的 _Container.create()_ ,而不是手动编写。
- 例如：用户页面(_UserPage_)，粉丝侧边栏(_FollowersSidebar_)，陈述容器页面(_StoryContainer_)，粉丝列表(_FollowedUserList_)。

### 这种方法的好处
- 分离关注点。通过这种方式编写组件，你将更好的理解你的应用和UI。
- 更好的可重用性。您可以用完全不同的状态(_state_)源来使用相同的展示组件，并将它们（_这些状态源_）转换为可以进一步重用的单一容器组件。
- 展示组件本质上是您的应用程序的“调色板”。您可以将它们放在一个页面上，让设计师在无需触及应用程序的逻辑的情况下调整所有变化，。您可以在该页面上运行屏幕快照回归测试。
- 这会强制你提取“布局(_layout_)组件”，例如侧边栏、页面、上下文菜单，并使用 _this.props.children_ 而不是在多个容器组件中复制相同的标记和布局。

> **<font color=#cb2431 size=7 face="黑体">谨记：组件无需发射(_emit_)DOM。他们只需要在UI关注点之间提供组合边界。</font>**

利用这些点。

### 什么时候该引入容器组件
我建议你在开始构建应用的时候，只使用展示组件。最终你会发现你在中间组件上传递了太多props。当你注意到某些组件不使用他们接收到的props而只是将它们向下转发时，你必须在子组件需要更多数据时重新连接所有这些中间组件，这是引入一些容器组件的好时机。这样，您可以获取到叶组件的数据和行为props，而不会在树的中间加载不相关的组件。

这是一个持续的重构过程，所以不要想着第一次就搞定它。当你尝试使用此模式时，你将养成直觉上就知道何时提取某些容器的能力，就像您知道什么时候提取函数一样。我的[免费Redux Egghead系列](https://egghead.io/series/getting-started-with-redux)也可以为您提供帮助！

### 其他二分法
重要的是要了解展示组件和容器组件之间的区别不是技术上的区分。相反，是用途上的区分。

###### 相比之下，这有一些相近的（但不同于）技术上的区别
- 有状态(_Stateful_)与无状态(_Stateless_)。有些组件使用React setState（）方法，有些组件则没有。虽然容器组件往往是有状态的，而展示组件往往是无状态的，但这不是一个硬性规则。展示组件可以是有状态的，容器也可以是无状态的。
- class和function。从React 0.14开始，组件可以声明为class和function。function组件更容易定义，但它们缺少当前仅可用class组件的某些功能。其中一些限制可能在将来消失，但它们现在存在。因为function组件更容易理解，所以我建议您使用它们，除非您需要状态，生命周期钩子或性能优化，这些只在此时才可用于class组件。
- 纯净(_pure_)与非纯净(_impure_)。人们说如果保证在相同的props和state下返回相同的结果，则组件是纯组件。纯组件既可以定义为类和函数，也可以是有状态的和无状态的。纯组件的另一个重要方面是它们不依赖于props或state中的深度突变，因此可以通过其[shouldComponentUpdate() 钩子中](https://facebook.github.io/react/docs/pure-render-mixin.html)的浅层比较来优化它们的渲染性能。目前只有class组件可以定义shouldComponentUpdate()，但将来可能会更改。 

展示组件和容器组件都可以落入这些万花桶中的任何一个。根据我的经验，展示组件往往是无状态的纯function，容器往往是有状态的纯class。然而，这不是一个规则，而要视情况而定，我已遇到过在特定情况下使用完全相反的情况更有用。

不要将展示组件和容器组件分离作为教条。有时这些东西无关紧要或很难划清界限。如果您不确定某个特定组件应该是展示组件还是容器组件，那么可能还为时过早去决定该用哪一个。别担心啦！

**案例**
[Michael Chan](https://twitter.com/chantastic)写的这个[要领](https://gist.github.com/chantastic/fc9e3853464dffdb1e3c)抓住了其主旨。

**拓展阅读**
- [Getting Started with Redux](https://egghead.io/series/getting-started-with-redux)
- [Mixins are Dead, Long Live Composition](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)
- [Container Components](https://medium.com/@learnreact/container-components-c0e67432e005)
- [Atomic Web Design](http://bradfrost.com/blog/post/atomic-web-design/)
- [Building the Facebook News Feed with Relay](http://facebook.github.io/react/blog/2015/03/19/building-the-facebook-news-feed-with-relay.html)

**补充说明**
> 在本文的早期版本中，我将它们称为“聪明(_smart_)”和“(_dumb_)”组件，但这对于展示组件过于苛刻，最重要的是，并没有真正解释其（使用）目的的差异。我更喜欢新术语，我希望你也一样！

> 在本文的早期版本中，我声称展示组件应仅包含其他展示组件。我不再认同这种情况。组件是展示组件还是容器是其实现细节决定的。您应该能够在不修改任何调用位置的情况下用容器组件替换展示组件。因此，展示组件和容器组件都可以包含其他展示组件或容器组件。


