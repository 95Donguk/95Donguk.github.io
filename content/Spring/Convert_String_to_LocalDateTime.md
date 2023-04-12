---
emoji: 🍃
title: String 형식의 날짜를 LocalDateTime 형식으로 변환하기
date: '2023-04-12 00:00:00'
author: 95Donguk
tags: Spring
categories: Spring
---

# String 형식의 날짜를 LocalDateTime 형식으로 변환하기
이 글에서는 스프링프레임워크의 `@DateTimeFormat` 어노테이션을 이용하여 String 형식의 날짜를 LocalDateTime 형식으로 변환하는 방법을 설명합니다.

## 이 글을 쓰게된 계기

[코드로 배우는 스프링 부트 웹 프로젝트](http://www.yes24.com/Product/Goods/96051853)에서 방명록 프로젝트 실습 중 `4.9.4 수정 화면에서 이벤트 처리` 부분을 실습하다 다음과 같은 에러가 발생했습니다.

```java
Resolved [org.springframework.validation.BindException: org.springframework.validation.BeanPropertyBindingResult: 2 errors<EOL>Field error in object 'guestbookDTO' on field 'modDate': rejected value [2023/04/06 23:18:20]; codes [typeMismatch.guestbookDTO.modDate,typeMismatch.modDate,typeMismatch.java.time.LocalDateTime,typeMismatch]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [guestbookDTO.modDate,modDate]; arguments []; default message [modDate]]; default message [Failed to convert property value of type 'java.lang.String' to required type 'java.time.LocalDateTime' for property 'modDate'; nested exception is org.springframework.core.convert.ConversionFailedException: Failed to convert from type [java.lang.String] to type [java.time.LocalDateTime] for value '2023/04/06 23:18:20'; nested exception is java.lang.IllegalArgumentException: Parse attempt failed for value [2023/04/06 23:18:20]]<EOL>Field error in object 'guestbookDTO' on field 'regDate': rejected value [2023/04/06 23:18:20]; codes [typeMismatch.guestbookDTO.regDate,typeMismatch.regDate,typeMismatch.java.time.LocalDateTime,typeMismatch]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [guestbookDTO.regDate,regDate]; arguments []; default message [regDate]]; default message [Failed to convert property value of type 'java.lang.String' to required type 'java.time.LocalDateTime' for property 'regDate'; nested exception is org.springframework.core.convert.ConversionFailedException: Failed to convert from type [java.lang.String] to type [java.time.LocalDateTime] for value '2023/04/06 23:18:20'; nested exception is java.lang.IllegalArgumentException: Parse attempt failed for value [2023/04/06 23:18:20]]]
```

에러 메시지를 보면 guestbookDTO의 modDate와 regDate 필드에 `2023/04/06 23:18:20` 이란 값이 rejected 됐다고 하고 메시지를 좀 더 보면…

```java
Failed to convert from type [java.lang.String] to type [java.time.LocalDateTime] for value '2023/04/06 23:18:20'
```

String 형식의 `2023/04/06 23:18:20` 를 LocalDateTime 형식 변환에 실패했다는 것을 볼 수 있습니다.

즉, 클라이언트에서의 String 형식의 날짜를 서버로 보낼 때 LocalDateTime 형식으로 변환할 수 있도록 만들어야 합니다.

## @DateTimeFormat

@DateTimeFormat 은 스프링프레임워크에서 제공하는 어노테이션 중 하나로, String 형식의 날짜를 자바의 LocalDate, LocalTime, LocalDateTime 등의 형식으로 변환할 때 사용합니다.

## 사용법

1. LocalDateTime 형식으로 변환하고자 하는 필드에 @DateTimeFormat 어노테이션을 추가합니다.

```java
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class GuestbookDTO {

    private Long gno;
    private String title;
    private String content;
    private String writer;
    @DateTimeFormat(pattern = "yyyy/MM/dd HH:mm:ss")
    private LocalDateTime regDate;
    @DateTimeFormat(pattern = "yyyy/MM/dd HH:mm:ss")
    private LocalDateTime modDate;
}
```
## 💡 틀렸거나 잘못된 정보가 있다면 망설임 없이 댓글로 알려주세요!

