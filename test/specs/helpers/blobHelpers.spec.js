import BlobImage from '../../../src/components/media/BlobImage';

import {
  DERIVATIVE_THUMBNAIL,
  DERIVATIVE_SMALL,
  DERIVATIVE_MEDIUM,
  DERIVATIVE_ORIGINAL_JPEG,
  DERIVATIVE_ORIGINAL,
  getDerivativeUrl,
  derivativeImage,
  thumbnailImage,
  smallImage,
  mediumImage,
  originalJpegImage,
  originalImage,
} from '../../../src/helpers/blobHelpers';

const expect = chai.expect;

chai.should();

describe('blobHelpers', function moduleSuite() {
  describe('getDerivativeUrl', function suite() {
    const serverUrl = 'http://cspace';

    const config = {
      serverUrl,
    };

    const csid = '1234';

    it('should return the url of a derivative', function test() {
      const derivative = 'SomeDerivativeName';

      getDerivativeUrl(config, csid, derivative).should
        .equal(`${serverUrl}/cspace-services/blobs/${csid}/derivatives/${derivative}/content`);
    });

    it('should return the url of the original image', function test() {
      const derivative = DERIVATIVE_ORIGINAL;

      getDerivativeUrl(config, csid, derivative).should
        .equal(`${serverUrl}/cspace-services/blobs/${csid}/content`);
    });

    it('should return a relative url if there is no services url', function test() {
      const derivative = 'SomeDerivativeName';

      getDerivativeUrl({}, csid, derivative).should
        .equal(`/cspace-services/blobs/${csid}/derivatives/${derivative}/content`);
    });
  });

  describe('derivativeImage', function suite() {
    it('should return a BlobImage with the given csid and derivative', function test() {
      const csid = '1234';
      const derivative = 'SomeDerivativeName';

      const component = derivativeImage(csid, derivative);

      component.type.should.equal(BlobImage);
      component.props.csid.should.equal(csid);
      component.props.derivative.should.equal(derivative);
    });

    it('should return null if no csid is supplied', function test() {
      const csid = null;
      const derivative = 'SomeDerivativeName';

      const component = derivativeImage(csid, derivative);

      expect(component).to.equal(null);
    });
  });

  describe('thumbnailImage', function suite() {
    it('should return a BlobImage with the given csid and the thumbnail derivative', function test() {
      const csid = '1234';

      const component = thumbnailImage(csid);

      component.type.should.equal(BlobImage);
      component.props.csid.should.equal(csid);
      component.props.derivative.should.equal(DERIVATIVE_THUMBNAIL);
    });
  });

  describe('smallImage', function suite() {
    it('should return a BlobImage with the given csid and the small derivative', function test() {
      const csid = '1234';

      const component = smallImage(csid);

      component.type.should.equal(BlobImage);
      component.props.csid.should.equal(csid);
      component.props.derivative.should.equal(DERIVATIVE_SMALL);
    });
  });

  describe('mediumImage', function suite() {
    it('should return a BlobImage with the given csid and the medium derivative', function test() {
      const csid = '1234';

      const component = mediumImage(csid);

      component.type.should.equal(BlobImage);
      component.props.csid.should.equal(csid);
      component.props.derivative.should.equal(DERIVATIVE_MEDIUM);
    });
  });

  describe('originalJpegImage', function suite() {
    it('should return a BlobImage with the given csid and the original jpeg derivative', function test() {
      const csid = '1234';

      const component = originalJpegImage(csid);

      component.type.should.equal(BlobImage);
      component.props.csid.should.equal(csid);
      component.props.derivative.should.equal(DERIVATIVE_ORIGINAL_JPEG);
    });
  });

  describe('originalImage', function suite() {
    it('should return a BlobImage with the given csid and the original derivative', function test() {
      const csid = '1234';

      const component = originalImage(csid);

      component.type.should.equal(BlobImage);
      component.props.csid.should.equal(csid);
      component.props.derivative.should.equal(DERIVATIVE_ORIGINAL);
    });
  });
});
