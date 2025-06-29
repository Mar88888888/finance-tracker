import { GroupsModule } from "../../src/groups/groups.module";

describe('Group module', () => {
  let sut: GroupsModule;
  beforeEach(() => {
      sut = new GroupsModule()
    });
  it('should be defined', ()=> {
    expect(sut).toBeDefined();
  })
});