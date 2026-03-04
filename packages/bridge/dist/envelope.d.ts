import { z } from 'zod';
export declare const RpcInvokeEnvelopeSchema: z.ZodObject<{
    version: z.ZodLiteral<"1">;
    type: z.ZodLiteral<"invoke">;
    id: z.ZodString;
    method: z.ZodString;
    params: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const RpcResultEnvelopeSchema: z.ZodObject<{
    version: z.ZodLiteral<"1">;
    type: z.ZodLiteral<"result">;
    id: z.ZodString;
    result: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const RpcEventEnvelopeSchema: z.ZodObject<{
    version: z.ZodLiteral<"1">;
    type: z.ZodLiteral<"event">;
    event: z.ZodString;
    data: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export declare const RpcEnvelopeSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    version: z.ZodLiteral<"1">;
    type: z.ZodLiteral<"invoke">;
    id: z.ZodString;
    method: z.ZodString;
    params: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
    version: z.ZodLiteral<"1">;
    type: z.ZodLiteral<"result">;
    id: z.ZodString;
    result: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    version: z.ZodLiteral<"1">;
    type: z.ZodLiteral<"event">;
    event: z.ZodString;
    data: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>], "type">;
export type RpcInvokeEnvelope = z.infer<typeof RpcInvokeEnvelopeSchema>;
export type RpcResultEnvelope = z.infer<typeof RpcResultEnvelopeSchema>;
export type RpcEventEnvelope = z.infer<typeof RpcEventEnvelopeSchema>;
export type RpcEnvelope = z.infer<typeof RpcEnvelopeSchema>;
export declare function encodeEnvelope(envelope: RpcEnvelope): string;
export declare function decodeEnvelope(payload: string): RpcEnvelope;
//# sourceMappingURL=envelope.d.ts.map