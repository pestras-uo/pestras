export enum HttpCode {
  // Information Responses
  //-----------------------------------------------------
  /**
   * The server has received the request headers and the client should proceed to send the request body.
   */
  CONTINUE = 100,
  /**
   * The requester has asked the server to switch protocols and the server has agreed to do so.
   */
  SWITCHING_PROTOCOL,
  /**
   * This code indicates that the server has received and is processing the request, but no response is available yet.
   */
  PROCESSING,
  /**
   * This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response.
   */
  EARLY_HINTS,

  // Success Responses
  //-----------------------------------------------------
  /**
   * Standard response for successful HTTP requests.
   */
  OK = 200,
  /**
   * The request has been fulfilled, resulting in the creation of a new resource.
   */
  CREATED,
  /**
   * The request has been accepted for processing, but the processing has not been completed.
   */
  ACCEPTED,
  /**
   * The server is a transforming proxy
   */
  NON_AUTHORITATIVE_INFORMATION,
  /**
   * The server successfully processed the request and is not returning any content.
   */
  NO_CONTENT,
  /**
   * The server successfully processed the request, but is not returning any content.
   */
  RESET_CONTENT,
  /**
   * This response code is used when the Range header is sent from the client to request only part of a resource. 
   */
  PARTIAL_CONTENT,
  /**
   * Conveys information about multiple resources, for situations where multiple status codes might be appropriate.
   */
  MULTI_STATUS,
  /**
   * Used inside a <dav:propstat> response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection.
   */
  ALREADT_REPORTED,
  /**
   * The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.
   */
  IM_USED,

  // Redirection Responses
  //-----------------------------------------------------
  /**
   * Multiple Choices redirect status response code indicates that the request has more than one possible responses.
   */
  MULTIPLE_CHOICES = 300,
  /**
   * 301 Moved Permanently redirect status response code indicates that the resource requested has been definitively moved to the URL given by the Location headers.
   * It is recommended to use the 301 code only as a response for GET or HEAD methods and to use the 308 Permanent Redirect for POST methods instead.
   */
  MOVED_PERMANENTLY,
  /**
   * 302 Found redirect status response code indicates that the resource requested has been temporarily moved to the URL given by the Location header.
   * It is recommended to set the 302 code only as a response for GET or HEAD methods and to use 307 Temporary Redirect instead
   */
  FOUND,
  /**
   * The server sent this response to direct the client to get the requested resource at another URI with a GET request.
   */
  SEE_OTHERS,
  /**
   * This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.
   */
  NOT_MODIFIED,
  /**
   * Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy.
   * It has been deprecated due to security concerns regarding in-band configuration of a proxy.
   */
  USE_PROXY,
  /**
   * This response code is no longer used; it is just reserved. It was used in a previous version of the HTTP/1.1 specification.
   */
  UNUSED,
  /**
   * 302 Found redirect status response code indicates that the resource requested has been temporarily moved to the URL given by the Location header.
   * It is recommended to set the 302 code only as a response for GET or HEAD methods and to use 307 Temporary Redirect instead
   */
  TEMPORARY_REDIRECT,
  /**
   * 308 Permanent Redirect redirect status response code indicates that the resource requested has been definitively moved to the URL given by the Location headers.
   * It is recommended to use the 301 code only as a response for GET or HEAD methods and to use the 308 Permanent Redirect for POST methods instead.
   */
  PERMANENT_REDIRECT,

  // Client Errors Responses
  //-----------------------------------------------------
  /**
   * The server cannot or will not process the request due to an apparent client error as invalid input type format.
   */
  BAD_REQUEST = 400,
  /**
   * Authentication is required and has failed or has not yet been provided.
   */
  UNAUTHORIZED,
  /**
   * This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems,
   * however this status code is used very rarely and no standard convention exists.
   */
  PAYMENT_REQUIRED,
  /**
   * The request was valid, but the server is refusing action.
   */
  FORBIDDEN,
  /**
   * The requested resource could not be found but may be available in the future.
   */
  NOT_FOUND,
  /**
   * A request method is not supported for the requested resource.
   */
  METHOD_NOT_ALLOWED,
  /**
   * The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
   */
  NOT_ACCEPTABLE,
  /**
   * The client must first authenticate itself with the proxy.
   */
  PROXY_AUTHENTICATION_REQUIRED,
  /**
   * The server timed out waiting for the request.
   */
  REQUEST_TIMEOUT,
  /**
   * Indicates that the request could not be processed because of conflict in the request.
   */
  CONFLICT,
  /**
   * Indicates that the resource requested is no longer available and will not be available again.
   */
  GONE,
  /**
   * The request did not specify the length of its content, which is required by the requested resource.
   */
  LENGTH_REQUIRED,
  /**
   * The client has indicated preconditions in its headers which the server does not meet.
   */
  PRECONDITION_FAILED,
  /**
   * The request is larger than the server is willing or able to process.
   */
  PAYLOAD_TOO_LARGE,
  /**
   * The URI provided was too long for the server to process.
   */
  URI_TOO_LONG,
  /**
   * The request entity has a media type which the server or resource does not support.
   */
  UNSUPPORTED_MEDIA_TYPE,
  /**
   * The range specified by the Range header field in the request can't be fulfilled; it's possible that the range is outside the size of the target URI's data.
   */
  RANGE_NOT_STATISFIABLE,
  /**
   * This response code means the expectation indicated by the Expect request header field can't be met by the server.
   */
  EXPECTATION_FAILED,
  /**
   * The server refuses the attempt to brew coffee with a teapot.
   */
  IM_A_TEAPOT,
  /**
   * The request was directed at a server that is not able to produce a response.
   * This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.
   */
  MISDIRECTED_REQUEST = 421,
  /**
   * The request was well-formed but was unable to be followed due to semantic errors.
   */
  UNPROCESSABLE_ENTITY,
  /**
   * The 423 (Locked) status code means the source or destination resource of a method is locked.
   * This response SHOULD contain an appropriate precondition or postcondition code, 
   * such as 'lock-token-submitted' or 'no-conflicting-lock'.
   */
  LOCKED,
  /**
   * The request failed due to failure of a previous request.
   */
  FAILED_DEPENDANCY,
  /**
   * Indicates that the server is unwilling to risk processing a request that might be replayed.
   */
  TOO_EARLY,
  /**
   * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
   * The server sends an Upgrade header in a 426 response to indicate the required protocol(s)
   */
  UPGRADE_REQUIRED,
  /**
   * The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem,
   * where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server,
   * leading to a conflict.
   */
  PRECONDITION_REQUIRED = 428,
  /**
   * The user has sent too many requests in a given amount of time ("rate limiting").
   */
  TOO_MANY_REQUESTS,
  /**
   * The server is unwilling to process the request because either an individual header field, 
   * or all the header fields collectively, are too large.
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  /**
   * The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.
   */
  UNAVAILABLE_FOR_LEGAL_REASONS = 251,
  /**
   *  indicates an expired or otherwise invalid token.
   */
  INVALID_TOKEN = 498,
  /**
   *  indicates that a token is required but was not submitted.
   */
  TOKEN_REQUIRED,

  // Server Errors Responses
  //-----------------------------------------------------
  /**
   * A generic error message.
   */
  INTERNAL_SERVER_ERROR = 500,
  /**
   * The server either does not recognize the request method, or it lacks the ability to fulfil the request.
   */
  NOT_IMPLEMENTED,
  /**
   * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
   */
  BAD_GATEWAY,
  /**
   * The server is currently unavailable (because it is overloaded or down for maintenance).
   */
  SERVIC_UNAVAILABLE,
  /**
   * The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
   */
  GATEWAY_TIMEOUT,
  /**
   * The HTTP version used in the request is not supported by the server.
   */
  HTTP_VERSION_NOT_SPPORTED,
  /**
   * The server has an internal configuration error:
   * the chosen variant resource is configured to engage in transparent content negotiation itself,
   * and is therefore not a proper end point in the negotiation process.
   */
  VARIANT_ALSO_NEGOCIATES,
  /**
   * The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.
   */
  INSUFFICIENT_STORAGE,
  /**
   * The server detected an infinite loop while processing the request.
   */
  LOOP_DETECTED,
  /**
   * Further extensions to the request are required for the server to fulfill it.
   */
  NOT_EXTENDED = 510,
  /**
   * The 511 status code indicates that the client needs to authenticate to gain network access.
   */
  NETWORK_AUTHENTICATION_REQUIRED,
  /**
   * The 520 error is used as a "catch-all response for when the origin server returns something unexpected".
   */
  UNKNOWN_ERROR = 520
}