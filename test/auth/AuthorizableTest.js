const { assert } = require('../utils');

const Authorizable = artifacts.require('Authorizable');

contract('Authorizable', (accounts) => {
  const sut = {};
  const AUTHORIZED_ROLE_FLAG = 'authorized_role';
  const validatingAccount = accounts[0];

  beforeEach(async () => {
    sut.instance = await Authorizable.new();
  });

  it('should grant authorized_role to account', async () => {
    // when
    await sut.instance.grantAccessToAddress(validatingAccount);

    // then
    const isGranted = await sut.instance.hasRole.call(validatingAccount, AUTHORIZED_ROLE_FLAG);
    assert.isTrue(isGranted);
  });

  it('should revoke authorized_role from account', async () => {
    // given
    await sut.instance.grantAccessToAddress(validatingAccount);

    // when
    await sut.instance.revokeAccessFromAddress(validatingAccount);

    // then
    const isGranted = await sut.instance.hasRole.call(validatingAccount, AUTHORIZED_ROLE_FLAG);
    assert.isFalse(isGranted);
  });
});
