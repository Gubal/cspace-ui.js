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
    InputTable,
  } = pluginContext.recordComponents;

  return (
    <Field name="document">
      <Panel name="info" collapsible>
        <Row>
          <Field name="loanOutNumber" />
          <Field name="loanPurpose" />
        </Row>

        <InputTable name="lender">
          <Field name="lendersAuthorizer" />
          <Field name="lendersContact" />
          <Field name="lendersAuthorizationDate" />
        </InputTable>

        <InputTable name="borrower">
          <Field name="borrower" />
          <Field name="borrowersContact" />
          <Field name="borrowersAuthorizer" />
          <Field name="borrowersAuthorizationDate" />
        </InputTable>

        <Row>
          <Field name="specialConditionsOfLoan" />
          <Field name="loanOutNote" />
        </Row>

        <Field name="loanStatusGroupList">
          <Field name="loanStatusGroup">
            <Field name="loanStatus" />
            <Field name="loanStatusDate" />
            <Field name="loanStatusNote" />
          </Field>
        </Field>

        <Row>
          <Field name="loanOutDate" />
          <Field name="loanReturnDate" />
          <Field name="loanRenewalApplicationDate" />
        </Row>
      </Panel>
    </Field>
  );
};

export default pluginContext => ({
  template: template(pluginContext),
});
