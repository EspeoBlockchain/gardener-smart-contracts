const { assert } = require('.');

const StringParser = artifacts.require('StringParserCoverage');

contract('StringParser', () => {
  const sut = {};

  beforeEach(async () => {
    sut.instance = await StringParser.new();
  });

  it('should parse "123" string into correct uint', async () => {
    // given
    const value = '123';

    // when
    const result = await sut.instance.toUint(value);

    // then
    assert.equal(result, 123);
  });

  it('should throw error during parsing string to uint with characters other than digits', async () => {
    // given
    const value = '1a3';

    // when
    const query = sut.instance.toUint(value);

    return assert.isRejected(query);
  });

  it('should parse "123.45" string to 123 uint', async () => {
    // given
    const value = '123.45';

    // when
    const result = await sut.instance.toUint(value);

    // then
    return assert.equal(result, 123);
  });

  it('should allow only one dot into parsing string', async () => {
    // given
    const value = '123.456.789';

    // when
    const query = sut.instance.toUint(value);

    // then
    return assert.isRejected(query);
  });

  it('should parse "123" string into correct int', async () => {
    // given
    const value = '123';

    // when
    const result = await sut.instance.toInt(value);

    // then
    assert.equal(result, 123);
  });

  it('should parse "-123" string into correct int', async () => {
    // given
    const value = '-123';

    // when
    const result = await sut.instance.toInt(value);

    // then
    assert.equal(result, -123);
  });

  it('should make "123" substring from "-123" string', async () => {
    // given
    const value = '-123';

    // when
    const result = await sut.instance.substring(value, 1, 4);

    // then
    assert.equal(result, '123');
  });

  it('should concat two strings', async () => {
    // given
    const value1 = '123';
    const value2 = '456';

    // when
    const result = await sut.instance.concat(value1, value2);

    // then
    assert.equal(result, '123456');
  });

  it('should return true when comparing the same strings', async () => {
    // given
    const value = '123';
    const sameValue = '123';

    // when
    const result = await sut.instance.compare(value, sameValue);

    // then
    assert.isTrue(result);
  });

  it('should return false when comparing different strings', async () => {
    // given
    const value = '123';
    const differentValue = '456';

    // when
    const result = await sut.instance.compare(value, differentValue);

    // then
    assert.isFalse(result);
  });

  it('should return valid occurrence of needle in haystack using indexOf method', async () => {
    // given
    const haystack = '123456';
    const needle = '345';

    // when
    const result = await sut.instance.indexOf(haystack, needle);

    // then
    assert.equal(result, 2);
  });

  it('should return -1 when needle matches only partially', async () => {
    // given
    const haystack = '123456';
    const needle = '346';

    // when
    const result = await sut.instance.indexOf(haystack, needle);

    // then
    assert.equal(result, -1);
  });

  it('should return -1 if needle was not found', async () => {
    // given
    const haystack = '123456';
    const needle = 'x';

    // when
    const result = await sut.instance.indexOf(haystack, needle);

    // then
    assert.equal(result, -1);
  });

  it('should return -1 if haystack is empty', async () => {
    // given
    const haystack = '';
    const needle = '123';

    // when
    const result = await sut.instance.indexOf(haystack, needle);

    // then
    assert.equal(result, -1);
  });

  it('should return -1 if needle is empty', async () => {
    // given
    const haystack = '123456';
    const needle = '';

    // when
    const result = await sut.instance.indexOf(haystack, needle);

    // then
    assert.equal(result, -1);
  });

  it('should return -1 if haystack is shorter than needle', async () => {
    // given
    const haystack = '123';
    const needle = '123456';

    // when
    const result = await sut.instance.indexOf(haystack, needle);

    // then
    assert.equal(result, -1);
  });
});
