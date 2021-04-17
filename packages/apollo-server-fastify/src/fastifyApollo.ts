import {
  convertNodeHttpToRequest,
  GraphQLOptions,
  runHttpQuery,
} from 'apollo-server-core'
import { ValueOrPromise } from 'apollo-server-types'
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from 'fastify'
import { processRequest } from 'graphql-upload'

export async function graphqlFastify(
  options: (
    request?: FastifyRequest,
    reply?: FastifyReply,
  ) => ValueOrPromise<GraphQLOptions>,
): Promise<RouteHandlerMethod> {
  if (!options) {
    throw new Error('Apollo Server requires options.')
  }
    return async (request: any, reply: FastifyReply) => {



      // FIXME :  multipart in progress

      if ((request.isMultipart())) {
        try {

          console.info("MULTIPART FROM VINZ !")



          const processRequestOptions = {}



          const body = await processRequest(request.raw, reply.raw, processRequestOptions)




            // ORIGINAL CODE RECOPIED HERE
            try {

            console.info("MULTIPAR OK, GO TO ")
              const { graphqlResponse, responseInit } = await runHttpQuery(
                [request, reply],
                {
                  method: request.raw.method as string,
                  options,

                  query: body,
                  /*
                  query: (request.raw.method === 'POST'
                    ? request.body
                    : request.query) as any,*/
                  request: convertNodeHttpToRequest(request.raw),
                },
              )

              if (responseInit.headers) {
                for (const [name, value] of Object.entries<string>(
                  responseInit.headers,
                )) {
                  reply.header(name, value)
                }
              }
              reply.serializer((payload: string) => payload)
              reply.send(graphqlResponse)
            } catch (error) {
              if ('HttpQueryError' !== error.name) {
                throw error
              }

              if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                  reply.header(header, error.headers[header])
                })
              }

              reply.code(error.statusCode)
              reply.serializer((payload: string) => payload)
              reply.send(error.message)
            }
        } catch (err) {
          console.error("**** processRequest ERROR ***")
          console.error(err)
        }
      }


      // ORIGINAL CODE
      else {


        try {
          const { graphqlResponse, responseInit } = await runHttpQuery(
            [request, reply],
            {
              method: request.raw.method as string,
              options,
              query: (request.raw.method === 'POST'
                ? request.body
                : request.query) as any,
              request: convertNodeHttpToRequest(request.raw),
            },
          )

          if (responseInit.headers) {
            for (const [name, value] of Object.entries<string>(
              responseInit.headers,
            )) {
              reply.header(name, value)
            }
          }
          reply.serializer((payload: string) => payload)
          reply.send(graphqlResponse)
        } catch (error) {
          if ('HttpQueryError' !== error.name) {
            throw error
          }

          if (error.headers) {
            Object.keys(error.headers).forEach(header => {
              reply.header(header, error.headers[header])
            })
          }

          reply.code(error.statusCode)
          reply.serializer((payload: string) => payload)
          reply.send(error.message)
        }
      }
  }
}
