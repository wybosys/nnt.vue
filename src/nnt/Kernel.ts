/** 序列化的接口 */
export interface ISerializable {
  /** 序列化对象到流，返回结果 */
  serialize(stream: any): any;

  /** 从流中构建对象 */
  unserialize(stream: any): boolean;
}

/** 缓存策略控制接口 */
export interface ICacheObject {
  // 是否强制刷新
  cacheFlush: boolean;

  // 是否已经更新
  cacheUpdated: boolean;

  // 过期的时间段
  cacheTime: number;

  // 获得唯一标记
  keyForCache(): string;

  // 值
  valueForCache(): any;
}
