/** 序列化的接口 */
export interface ISerializable {
  /** 序列化对象到流，返回结果 */
  serialize(stream: any): any;

  /** 从流中构建对象 */
  unserialize(stream: any): boolean;
}

