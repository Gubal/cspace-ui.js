import { defineMessages } from 'react-intl';

const template = (pluginContext) => {
  const {
    React,
  } = pluginContext.lib;

  const {
    Panel,
    Row,
  } = pluginContext.layoutComponents;

  const {
    Field,
  } = pluginContext.recordComponents;

  const {
    extensions,
  } = pluginContext.config;

  return (
    <Field name="document">
      <Panel name="id" collapsible>
        <Row>
          <div>
            <Field name="objectNumber" />

            <Field name="otherNumberList">
              <Field name="otherNumber">
                <Field name="numberValue" />
                <Field name="numberType" />
              </Field>
            </Field>

            <Field name="inventoryStatusList">
              <Field name="inventoryStatus" />
            </Field>
          </div>

          <div>
            <Field name="briefDescriptions">
              <Field name="briefDescription" />
            </Field>
          </div>
        </Row>

        <Field name="titleGroupList">
          <Field name="titleGroup">
            <Panel>
              <Row>
                <div>
                  <Field name="title" />
                  <Field name="titleLanguage" />
                </div>

                <div>
                  <Field name="titleType" />

                  <Field name="titleTranslationSubGroupList">
                    <Field name="titleTranslationSubGroup">
                      <Field name="titleTranslation" />
                      <Field name="titleTranslationLanguage" />
                    </Field>
                  </Field>
                </div>
              </Row>
            </Panel>
          </Field>
        </Field>

        <Field name="objectNameList">
          <Field name="objectNameGroup">
            <Field name="objectName" />
            <Field name="objectNameCurrency" />
            <Field name="objectNameLevel" />
            <Field name="objectNameSystem" />
            <Field name="objectNameType" />
            <Field name="objectNameLanguage" />
            <Field name="objectNameNote" />
          </Field>
        </Field>
      </Panel>

      <Panel name="desc" collapsible collapsed>
        {extensions.dimension.form}
      </Panel>

      <Panel name="prod" collapsible collapsed>
        <Row>
          <div>
            <Field name="objectProductionDateGroupList">
              <Field name="objectProductionDateGroup" />
            </Field>
          </div>

          <div />
        </Row>

        <Row>
          <Field name="objectProductionPersonGroupList">
            <Field name="objectProductionPersonGroup">
              <Field name="objectProductionPerson" />
              <Field name="objectProductionPersonRole" />
            </Field>
          </Field>

          <Field name="objectProductionOrganizationGroupList">
            <Field name="objectProductionOrganizationGroup">
              <Field name="objectProductionOrganization" />
              <Field name="objectProductionOrganizationRole" />
            </Field>
          </Field>
        </Row>
      </Panel>

      <Panel name="hierarchy" collapsible collapsed>
        <Field name="relation-list-item" subpath="rel:relations-common-list" />
      </Panel>
    </Field>
  );
};

export default pluginContext => ({
  messages: defineMessages({
    name: {
      id: 'form.collectionobject.inventory.name',
      defaultMessage: 'Inventory Template',
    },
  }),
  sortOrder: 1,
  template: template(pluginContext),
});
