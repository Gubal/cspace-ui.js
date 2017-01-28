import Immutable from 'immutable';
import defaultListTypesPlugin from '../../../../src/plugins/listTypes/default';

const expect = chai.expect;

chai.should();

const config = {
  recordTypes: {
    group: {
      name: 'group',
      serviceConfig: {
        objectName: 'Group',
      },
    },
    object: {
      name: 'object',
      serviceConfig: {
        objectName: 'CollectionObject',
      },
    },
    person: {
      name: 'person',
      serviceConfig: {
        objectName: 'Person',
        servicePath: 'personauthorities',
        serviceType: 'authority',
      },
      vocabularies: {
        local: {
          name: 'local',
          serviceConfig: {
            servicePath: 'urn:cspace:name(person)',
          },
        },
      },
    },
  },
};

describe('default list types', function suite() {
  const configContribution = defaultListTypesPlugin();
  const { listTypes } = configContribution;

  describe('common list', function typeSuite() {
    const commonList = listTypes.common;

    describe('getItemLocation', function funcSuite() {
      it('should compute the location from the docType and csid', function test() {
        commonList.getItemLocation(Immutable.fromJS({
          docType: 'CollectionObject',
          csid: '1234',
        }), { config }).should.equal('/record/object/1234');
      });

      it('should include the vocabulary path', function test() {
        commonList.getItemLocation(Immutable.fromJS({
          docType: 'Person',
          csid: '1234',
          refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(TestPerson1485582296109)\'Test Person\'',
        }), { config }).should.equal('/record/person/local/1234');
      });

      it('should fall back to the record type from the search descriptor if there is no docType', function test() {
        const searchDescriptor = {
          recordType: 'group',
        };

        commonList.getItemLocation(Immutable.fromJS({
          csid: '1234',
        }), { config, searchDescriptor }).should.equal('/record/group/1234');
      });

      it('should return null for an unknown record type', function test() {
        const searchDescriptor = {};

        expect(commonList.getItemLocation(Immutable.fromJS({
          docType: 'foo',
          csid: '1234',
        }), { config, searchDescriptor })).to.equal(null);
      });
    });
  });

  describe('auth ref list', function typeSuite() {
    const authRefList = listTypes.authRef;

    describe('getItemLocation', function funcSuite() {
      it('should compute the location from the refName', function test() {
        authRefList.getItemLocation(Immutable.fromJS({
          refName: 'urn:cspace:core.collectionspace.org:personauthorities:name(person):item:name(JaneDoe1484001439799)\'Jane Doe\'',
        }), { config }).should.equal('/record/person/local/urn:cspace:name(JaneDoe1484001439799)');
      });

      it('should return null for an unknown record type', function test() {
        expect(authRefList.getItemLocation(Immutable.fromJS({
          refName: 'urn:cspace:core.collectionspace.org:foobar:name(person):item:name(JaneDoe1484001439799)\'Jane Doe\'',
        }), { config })).to.equal(null);
      });
    });
  });
});
