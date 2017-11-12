# Configuration

The CollectionSpace UI is configured by passing a configuration object to the `cspaceUI` function, as in the following example:

```JavaScript
cspaceUI({
  basename: '/mymuseum',
  container: 'div.cspaceUI',
  serverUrl: 'https://nightly.collectionspace.org',
  messages: {
    'about.title': 'Welcome to My Museum CollectionSpace',
  },
});
```

A configuration function may be used instead of an object. The configuration function will be called by the cspace-ui framework at initialization time, and it should return a configuration object. The function will receive one parameter: a context object (pluginContext) that allows the function to access more of the cspace-ui API.

For example:

```JavaScript
cspaceUI((pluginContext) => {
  // Can access pluginContext here.

  return {
    basename: '/mymuseum',
    container: 'div.cspaceUI',
    serverUrl: 'https://nightly.collectionspace.org',
    messages: {
      'about.title': 'Welcome to My Museum CollectionSpace',
    },
  };
});
```

## Merging

The configuration object passed to `cspaceUI` (the *source* configuration) is merged into a default configuration (the *target* configuration). This allows the default value of any configuration property to be overridden.

A source configuration is merged into a target configuration as follows: First, if any [plugins](../developer/PluginGuide) are specified in the source configuration (under the [`plugins`](#plugins) key), each plugin is applied in order. The first plugin amends or overrides the target configuration, then the next plugin modifies that modified configuration, and so on, until all plugins have been applied. Finally, the remaining source configuration options are deeply merged into the resulting plugin-modified target configuration. Any properties that are present in the source configuration will override properties with the same key in the target configuration.

## Properties

The configuration object may contain the following properties.

### basename
```
basename: string = ''
```
The path on the web server where the UI is located. For example, if the HTML page containing the UI is published to http://somehost.com/cspace, `basename` should be set to `'/cspace'`.

### container
```
container: string = '#cspace'
```
The [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) used to locate the container element into which the UI will be rendered. If the selector matches more than one element, the first is used. The specified element should be empty, as its content will be overwritten.

### locale
```
locale: string = 'en'
```
The locale to use for formatting numbers, dates, and currency.

### messages
```
messages: { [id: string]: string }
```
An object containing messages to use to override the default messages. These may be translations, or any other customization. The keys are message IDs, and the values are strings to be displayed. For example:

```JavaScript
cspaceUI({
  messages: {
    // Override the login page title
    'about.title': 'My Museum CollectionSpace',

    // Override the label of the editionNumber field
    'field.collectionobjects_common.editionNumber.name': 'Ed. no.',

    // Override the label of the cubic-centimeters option
    'option.measurementUnits.cubic-centimeters': 'cm³',
  },
});
```

TODO: Devise and document a way to easily identify a message ID by looking at the UI in a browser.

TODO: Generate documentation of all message IDs and their descriptions.

### optionLists
```
optionLists: OptionListMap = defaultOptionLists
```
An object containing definitions of option lists, which are used to populate dropdowns. See the [option list configuration](./OptionListConfiguration.md) documentation for details. All option lists required by the core application are defined by default.

### plugins
```
plugins: Array<Plugin> = defaultPlugins
```
An array of plugins to be loaded. Plugins are downloadable modules that customize the UI; they do configuration, so you don't have to. A number of plugins are packaged with cspace-ui, and are loaded by default, including ones that implement the core record types and configure the default option lists.

TODO: Create a plugin configuration page.

### prettyUrls
```
prettyUrls: boolean = false
```
When `prettyUrls` is false (the default), the URLs of pages in the UI contain `#` and a generated hash string. For example, if the HTML page containing the UI is published to http://somehost.com/cspace, the URL of the Create New page would look something like http://somehost.com/cspace/#/create?_k=xu2oud. To make the URLs prettier, e.g. http://somehost.com/cspace/create, the web server must be configured so that any requests to http://somehost.com/cspace/** that are not found will fall back to the page at http://somehost.com/cspace. In apache, this may be done using the [`FallbackResource`](https://httpd.apache.org/docs/current/mod/mod_dir.html#fallbackresource) directive. Once the web server is configured with fallback support, `prettyUrls` may be set to true.

⚠️ Certain CollectionSpace features do not work correctly when `prettyUrls` is set to `false`. This setting is intended only to get the UI up and running quickly. Before doing a full evaluation or running the UI in production, the web server should be configured with fallback support, and `prettyUrls` should be set to `true`.

### recordTypes
```
recordTypes: RecordTypeMap = defaultRecordTypes
```
An object containing definitions of the record types that are known to the UI. See the [record type configuration](./RecordTypeConfiguration.md) documentation for details. All record types required by the core application are defined by default.

### serverTimeZone
```
serverTimeZone: string = 'UTC'
```
The time zone of the server specified in `serverUrl`, as a [time zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). This must be set to the correct time zone in order for searches on date fields to work properly. For example:

```JavaScript
cspaceUI({
  serverUrl: 'https://nightly.collectionspace.org',

  // nightly.collectionspace.org is on east coast time
  serverTimeZone: 'America/New_York',
});
```

### serverUrl
```
serverUrl: string = ''
```
The URL of the CollectionSpace services layer REST API. This should include the protocol, host, and port (if not 80), for example: `'http://demo.collectionspace.org:8180'`. If `serverUrl` is empty or unspecified, the REST API is assumed to be accessible at the same protocol, host, and port from which the HTML page containing the UI was retrieved. If the UI is served from a different host than the REST API, the services layer must be configured to accept CORS requests from the origin of the UI.

⚠️ Do not include the `/cspace-services` path in the `serverUrl` string.
