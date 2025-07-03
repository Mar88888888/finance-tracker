import { PurposesModule } from "../../src/purposes/purposes.module";

describe('Purpose module', () => {

  let sut: PurposesModule;

  beforeEach(() => {
    sut = new PurposesModule();
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })
})