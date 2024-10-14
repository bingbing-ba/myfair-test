import { atom } from "recoil";

interface SampleMember {
  name: string;
  age: number;
}

export const sampleMemberState = atom<SampleMember[]>({
  key: "sampleState",
  default: [
    {
      name: "홍길동",
      age: 20,
    },
  ],
});
