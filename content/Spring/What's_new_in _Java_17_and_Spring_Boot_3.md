---
emoji: 🍃
title: Java 17 과 SpringBoot 3 새로운 기능 알아보기
date: '2023-06-17 00:00:00'
author: 95Donguk
tags: Spring
categories: Spring
---

# Java 17과 SpringBoot 3 새로운 기능 알아보기
## 배경
![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/1.png)
- SpringBoot 2 버전이 상용지원 종료일이 2025년 8월 24일 약 1년 남은 상황에서 SpringBoot 3 버전으로 업데이트하기 위한 사전 조사 목적으로 이 글을 작성했습니다.
- SpringBoot 3 버전과 Java 17 버전의 주요 신 기능 위주 소개 및 어떻게 활용법에 대해 작성해보았습니다.

## 1-1. 스프링부트 3 주요 업데이트 사항

1. **Java 17 이상 지원**
2. Java EE 를 Jakarta EE로 대체
    - 패키지 명을 `javax.*` → `Jakarta.*`
3. **GraalVM기반 Spring Native 공식 지원**
4. **HTTP/RSocket Interface Client 제공**
5. Observability가 공식 지원
6. HTTP API 에러 처리를 위한 RFC 7807 스펙을 지원
7. 기타 
    1. 보안상의 이슈로 `/api/hello` 와 `/api/hello/` 는 더 이상 일치하지 않음
    2. Logback 및 Log4j2 날짜 및 시간의 기본값이 ISO-8601 표준을 따름
    3. 사용되지 않는 (Deprecated) 모든 코드가 제거
    4. Tomcat 10.1 적용
    5. Hibernate ORM 6.1 적용

> 위 스프링 부트 업데이트 사항 중 자바 17 신 기술 3가지와 Spring Native, HTTP Interface에 대해 소개하겠습니다.

# 2. 주요 신 기능

## 2-1. Java17

### 텍스트 블록 기능

`"""{문자열}"""` 형식을 이용해 멀티 라인 문자열을 가독성있게 작성하도록 도와줍니다.

> Java 17 이전 버전

```java
public class TextBlockExam {

  public static void main(String[] args) {
    String text = "동해물과 백두산이 마르고 닳도록\n" +
        "하느님이 보우하사 우리나라 만세\n" +
        "무궁화 삼천리 화려 강산\n" +
        "대한사람 대한으로 길이 보전하세";

    System.out.println(text);
  }
}
```

> 텍스트 블록
```
public class TextBlockExam {

  public static void main(String[] args) {
    String text = """
        동해물과 백두산이 마르고 닳도록
        하느님이 보우하사 우리나라 만세
        무궁화 삼천리 화려 강산
        대한사람 대한으로 길이 보전하세
        """;

    System.out.println(text);
  }
}
```

- 스타일 지침
    - 여러 줄의 문자열인 경우 코드의 명확성을 위해 텍스트 블록을 사용해야 합니다.
    - 문자열이 한 줄인 경우 문자열 리터럴을 계속 사용해야 합니다.
    - 텍스트 블록을 들여쓰기 하려면 공백만 사용하거나 탭만 사용해야 합니다. 섞어서 사용할 경우 들여쓰기가 불규칙하게 됩니다.

---
### 봉인(Sealed) 클래스

- 무분별한 상속을 막기 위한 목적으로 등장한 기능으로 지정한 클래스 외 상속을 허용하지 않습니다.
- 핵심은 `확장(extends) 하거나 구현(implements) 할 수 있는 클래스 또는 인터페이스를 제한한다.`
- 규칙
    1. sealed 클래스와 permitted된 서브 클래스와 동일한 모듈 또는 패키지에 속해야합니다.
    2. 모든 permits 자식 클래스는 sealed 클래스를 확장(extends)해야한다. 그렇지 않으면 컴파일 오류가 발생한다.
    3. 모든 permitted 서브 클래스는 수퍼 클래스에 의해 시작된 봉인을 계속할지 말지 선언해야합니다.
        - `final` : 더 이상 확장(extends)하지 않습니다.
        - `non-sealed` : 다른 클래스가 확장(extends)하도록 할 수 있습니다.
            - 봉인 특성 해제
        - `sealed` : 자기 자신을 봉인클래스로 선언합니다.
> Java 17 이전 버전

```java
// 패키지내 비공개 접근 방식
public class Vehicles {

    abstract static class Vehicle {

        private final String registrationNumber;

        public Vehicle(String registrationNumber) {
            this.registrationNumber = registrationNumber;
        }

        public String getRegistrationNumber() {
            return registrationNumber;
        }

    }

    public static final class Car extends Vehicle {

        private final int numberOfSeats;

        public Car(int numberOfSeats, String registrationNumber) {
            super(registrationNumber);
            this.numberOfSeats = numberOfSeats;
        }

        public int getNumberOfSeats() {
            return numberOfSeats;
        }

    }

    public static final class Truck extends Vehicle {

        private final int loadCapacity;

        public Truck(int loadCapacity, String registrationNumber) {
            super(registrationNumber);
            this.loadCapacity = loadCapacity;
        }

        public int getLoadCapacity() {
            return loadCapacity;
        }

    }

}
```

> Sealed 클래스
- 슈퍼 클래스는 `sealed` 선언부에 적용하고, `permits`로 지정된 클래스들이 상속을 할 수 있도록 허가합니다.

```java
public sealed interface Service permits Car, Truck {

    int getMaxServiceIntervalInMonths();

    default int getMaxDistanceBetweenServicesInKilometers() {
        return 100000;
    }

}
```

```java
public abstract sealed class Vehicle permits Car, Truck {

    protected final String registrationNumber;

    public Vehicle(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

}

```

```java
public final class Truck extends Vehicle implements Service {

    private final int loadCapacity;

    public Truck(int loadCapacity, String registrationNumber) {
        super(registrationNumber);
        this.loadCapacity = loadCapacity;
    }

    public int getLoadCapacity() {
        return loadCapacity;
    }

    @Override
    public int getMaxServiceIntervalInMonths() {
        return 18;
    }

}

```

```java
public non-sealed class Car extends Vehicle implements Service {

    private final int numberOfSeats;

    public Car(int numberOfSeats, String registrationNumber) {
        super(registrationNumber);
        this.numberOfSeats = numberOfSeats;
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }

    @Override
    public int getMaxServiceIntervalInMonths() {
        return 12;
    }

}
```

### 🤔어떻게 사용하면 좋을까?

1. **도메인 모델링**: 웹 애플리케이션의 비즈니스 로직을 모델링하는 데 봉인 클래스를 사용할 수 있습니다.<br> 
예를 들어, 사용자의 다양한 역할(관리자, 사용자, 게스트 등)을 나타내는 클래스 계층구조를 만들 때 봉인 클래스를 사용하면, 새로운 역할이 임의로 추가되는 것을 방지할 수 있습니다.

2. **API 응답**: 웹 API의 응답을 모델링하는 데 봉인 클래스를 사용할 수 있습니다.<br>
예를 들어, API 요청의 결과를 나타내는 클래스를 봉인 클래스로 만들면, API 응답이 예상된 형태로만 반환되도록 할 수 있습니다.

봉인 클래스는 상속을 제한하기 때문에 코드의 유연성이 떨어질 수 있습니다.

> 봉인 클래스 적용 전

```java
@Getter
@JsonPropertyOrder({"code", "message", "data"})
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ApiResponse<T> {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final String code;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final T data;

}
```

```java
@Getter
@JsonPropertyOrder({"code", "message", "status"})
@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ErrorResponse {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final String code;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final String message;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final int status;
}
```

> 봉인클래스 적용 후

```java
@Getter
@JsonPropertyOrder({"code", "message"})
@RequiredArgsConstructor(access = AccessLevel.PACKAGE)
abstract sealed class Response permits ApiResponse, ErrorResponse {

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private final String code;

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private final String message;
}
```

```java
@Getter
public non-sealed class ApiResponse<T> extends Response {

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private final T data;

  @Builder
  private ApiResponse(final String code, final String message, final T data) {
    super(code, message);
    this.data = data;
  }
}
```

```java
@Getter
public final class ErrorResponse extends Response {

  @JsonInclude(JsonInclude.Include.NON_NULL)
  private final int status;

  @Builder
  private ErrorResponse(final String code, final String message, final int status) {
    super(code, message);
    this.status = status;
  }
}
```
---
### Record class

- 데이터를 객체 간에 전달하는 작업을 하도록 설계된 필드 유형과 이름만 필요한 불변 데이터 클래스 타입입니다.
- 생성자, 접근제어자, `equals`, `hashCode`, `toString` 메소드를 자동으로 만들어줍니다.
- 특징
    - `private final` 로 선언됩니다.
    - 필드 별로 Getter가 자동 생성됩니다.
        - 주의점 : 일반적인 Getter 네이밍인 `getXXX` 가 아닌 멤버변수 명이 메소드명으로 지정되어 있습니다.
    - 다른 클래스를 상속 받을 수 없으며, `private final` 필드 이외의 인스턴스 필드를 선언할 수 없으며 선언되는 다른 모든 필드는 `static`이어야 합니다.

> 일반적인 클래스 

```java
public final class Rectangle {
    private final double length;
    private final double width;

    public Rectangle(double length, double width) {
        this.length = length;
        this.width = width;
    }

    double length() { return this.length; }
    double width()  { return this.width; }

    public boolean equals...
    public int hashCode...

    public String toString() {...}
}
```

> record 클래스


```java
public record Rectangle(double length, double width) { }
```

> 컴팩트 생성자
> - validation에 사용하기 위한 생성자

```java
// 일반 생성자
record Rectangle(double length, double width) {
    public Rectangle(double length, double width) {
        if (length <= 0 || width <= 0) {
            throw new java.lang.IllegalArgumentException(
                String.format("Invalid dimensions: %f, %f", length, width));
        }
        this.length = length;
        this.width = width;
    }
}
```

```java
// 컴팩트 생성자
record Rectangle(double length, double width) {
    public Rectangle {
        if (length <= 0 || width <= 0) {
            throw new java.lang.IllegalArgumentException(
                String.format("Invalid dimensions: %f, %f", length, width));
        }
    }
}
```

### 🤔어떻게 사용하면 좋을까?

> 일반 클래스의 RequestDTO

```java
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CreateProfileRequest {

    @Pattern(
        regexp = "^[가-힣a-zA-Z0-9-_]{2,8}$",
        message = "닉네임은 영문 대소문자, 숫자, 한글로 구성된 2 ~ 8자리로 입력해주세요."
    )
    @NotNull(message = "별명은 필수입니다")
    private String nickname;

    @Pattern(regexp = "^01(?:0|1|[6-9])(?:\\d{7}|\\d{8})$",
        message = "휴대전화 번호는 하이픈(-)을 제외한 10자리 또는 11자리로 입력해주세요.")
    @NotNull(message = "휴대전화 번호는 필수입니다")
    private String phoneNumber;

    private String address;

    public Profile toEntity(final ProfileStatus profileStatus,
                            final Member member) {
        return Profile.builder()
            .nickname(nickname)
            .phoneNumber(phoneNumber)
            .address(address)
            .profileStatus(profileStatus)
            .member(member)
            .build();
    }
}
```

> Record 클래스 RequestDTO


```java
public record CreateProfileRequest(
    @Pattern(
        regexp = "^[가-힣a-zA-Z0-9-_]{2,8}$",
        message = "닉네임은 영문 대소문자, 숫자, 한글로 구성된 2 ~ 8자리로 입력해주세요."
    )
    @NotNull(message = "별명은 필수입니다")
    String nickname,

    @Pattern(regexp = "^01(?:0|1|[6-9])(?:\\d{7}|\\d{8})$",
        message = "휴대전화 번호는 하이픈(-)을 제외한 10자리 또는 11자리로 입력해주세요.")
    @NotNull(message = "휴대전화 번호는 필수입니다")
    String phoneNumber,

    String address
) {
  public Profile toEntity(final ProfileStatus profileStatus,
      final Member member) {
    return Profile.builder()
        .nickname(nickname)
        .phoneNumber(phoneNumber)
        .address(address)
        .profileStatus(profileStatus)
        .member(member)
        .build();
  }
}
```

---
## **2-2. SpringBoot3**

## Spring Native

### Spring Native를 이해하기 위한 사전 개념 설명

Spring Native를 잘 이해하기 위해서는 JVM, GraalVM, Native Image 개념에 대해 알고 있어야 합니다.

- JVM 구조
![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/2.png)
- 자세한 내용은 https://inpa.tistory.com/entry/JAVA-☕-JVM-내부-구조-메모리-영역-심화편 참고해주세요.

- JIT(Just-In-Time) Compiler
    - 바이트 코드 명령어를 하나씩 읽어 해석하고 바로 실행하는 인터프리터의 단점을 보완하기 위해 사용하는 **컴파일러로 반복되는 코드을 찾아 바이트 코드 전체를 컴파일하여 기계어로 생성하고 해당 코드를 캐싱해두었다가 기계어로 바로 실행하는 방식**으로 구동합니다.
    - JVM 은 기본적으로 인터프리터 방식으로 바이트코드를 기계어로 변환하고 일정 기준을 넘어가면 JIT 컴파일 방식으로 명령어를 실행합니다.
    - 
    ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/3.png)

  - HotSpot: 애플리케이션에서 자주 실행된다고 판단되는 특정 부분만을 기계어로 컴파일합니다.
      - 프로파일링: 컴파일러는 실행 중인 애플리케이션의 동작을 분석하고 코드 실행 횟수, 루프 반복 횟수, 메소드 호출 등의 정보를 측정하고 기록을 합니다.
  - Compiler interface: Java 소스 코드를 컴파일하여 바이트코드로 변환하는 기능을 제공하는 인터페이스입니다.
  - C1 컴파일러(클라이언트 컴파일러): C++로 구현된 JIT 컴파일러로 가능한 빠른 실행 속도를 위해 코드를 가능한 빠르게 최적화하고 컴파일합니다.
      - 초기에 C1 컴파일러로 최적화를 진행합니다.
  - **C2 컴파일러(서버 컴파일러)**: C++로 구현된 JIT 컴파일러로 시작되는 속도가 느리지만 C1 컴파일러보다 안정적이고 더 높은 수준의 최적화를 수행합니다.
    - warm-up 안정화가 되면 C2 컴파일러로 진행합니다.
    > 애플리케이션 구동 시 컴파일러 흐름
    ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/4.png)

- GraalVM
    - 오라클 사의 Java로 구현된 HotSpot/OpenJDK 기반의 차세대 JVM 및 JDK
    - **만들어지게 된 계기**
        
        현재 JDK의 C2 컴파일러가 더 이상 성능 개선이 어렵고 유지보수가 복잡하며 C++ 개발자의 인력난과 함께 최근 주요 업데이트 공백 기간이 길어지면서 C2 컴파일러의 한계를 느껴 대안책이 필요했습니다.
        
        코드 최적화 알고리즘의 적용을 잘할 수 있도록 속도가 개선된 Java 기반의 컴파일러를 만들게 되었습니다.
        
    - 특징
        - AOT Compiler ↔ JIT Compiler
            - **AOT(Ahead-Of-Time) Compiler**
                - **빌드 타임**에 코드의 무겁고 복잡한 분석 및 최적화를 수행하여 기계어를 생성합니다.
                - 미리 타깃 OS에 실행파일(Native Image)을 만들어 특정 OS에 Java를 설치할 필요도 없게 되고 기계어로 미리 생성되어 있기 때문에 거의 즉시 실행됩니다.
            - GraalVM Native Image, AOT Compilation을 기반으로한 JIT Compiler를 사용
                - JVM 위한 JIT 컴파일러로 사용되거나 GraalVM Native Image로 만들기 위한 Java 바이트 코드를 기계어 코드로 변환하는 AOT 컴파일러로 사용됩니다.
    - Truffle 언어 구현 프레임워크 및 GraalVM SDK 제공
        - 다른 프로그래밍 언어(JavaScript, Ruby, R 등)를 런타임으로 동작할 수 있게 지원
    - 기존 JDK와 차이점
       ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/5.png)
    - C2 vs Graal 컴파일러 연산 성능 비교
       ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/6.png)
       - 참고: [[25th Developer Meetup] 한 단계 진화한 GraalVM, Spring Native 활용해 보기](https://www.youtube.com/watch?v=54rxc2dEv10)
    - 실제 연산 성능 비교(M3 Pro)
      - C2 컴파일러
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/8.png)
        - Avg 101 ns/op
        --- 
      - Graal 컴파일러(JIT mode)
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/7.png)
        - Avg 79 ns/op
    - 실제 연산 성능 비교(Intel i7 Gen11)
      - C2 컴파일러
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/9.png)
        - Avg 183ns/op
      - Graal 컴파일러(JIT mode)
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/10.png)
        - Avg 127ns/op
### Native Image

- Java 코드를 AOT 컴파일러에 의해 생성된 독립적으로 실행 가능한 네이티브 실행 파일<br>
생성된 네이티브 실행 파일(바이너리)은 JVM이 설치되어 있지 않아도 OS와 머신 아키텍처에서 사용할 수 있습니다. (Java 프로그램을 아예 실행파일로 만들어버리고 실행파일을 직접 실행하는 방식)
- 등장하게 된 계기
    
    기존 환경의 자바 애플리케이션은 JVM 위에 애플리케이션을 구동하는데 이로 인한 단점으로 애플리케이션 실행 시간이 오래 걸리고 메모리 사용량이 높아 클라우드 환경에서 빠르고 효율적인 배포가 어려웠습니다
    
    그래서 JVM이 설치되어 있지 않은 환경에도 자원 사용량을 최소화하고 빠르게 실행하여 워밍업 없이 최고 성능을 낼 수 있는 방식이 필요했습니다.
    
- 특징
    - 실행 파일에는 애플리케이션 클래스, 외부 라이브러리 의존성 등의 정적으로 연결된 기계어가 포함
    - SVM(Substrate VM) 내장 (!= JVM)
        - JVM이 담당하던 메모리 관리, 스레드 스케줄링 담당
        - 기존 JVM보다 GC나 Thread Control 성능이 좋지 않음
    - 장점
        - 빠른 시작 시간
            - 메인 메소드가 실행되기 이전의 실행 준비 단계를 모두 처리하여 이미지에 포함
        - 낮은 메모리 사용량
        - 작은 패키지 파일 용량
            - 빌드타임의 최적화 과정에서 애플리케이션에 필요한 클래스, 메소드 및 종속 라이브러리만 포함하므로 컴팩트함
            - 빌드환경에 따라 용량 차이가 있을 수 있고 실행파일을 UPX로 압축시켜야 함
    - 단점
        - Musl 라이브러리[1)](https://wiki.musl-libc.org/)를 사용하는 알파인 리눅스용으로 빌드한 Native Image는 glibc 라이브러리[2)](https://www.gnu.org/software/libc/)를 사용하는 오라클 리눅스에서는 실행되지 않습니다.
        - Native Image로 컴파일하는 시간이 Java 소스 코드에서 바이트코드로 컴파일하는 시간보다 오래 걸립니다.
    - 컨테이너 이미지를 사용하여 배포하는 애플리케이션에 매우 적합합
        - Spring Cloud Function을 사용하는 서버리스 애플리케이션
        - Spring을 이용한 마이크로서비스
        - Kubernetes 환경에서의 애플리케이션
    - JVM 배포와 주요 차이점
        - Native Image가 생성될 때 사용하지 않는 코드는 제거
        - GraalVM은 코드의 동적 요소를 직접 인식하지 못하며 리플렉션, 리소스, 직렬화 및 동적 프록시에 대해 정보 제공 (= 메타데이터 수기 작성 필요)
        - 애플리케이션에 정의된 빈은 런타임에 변경 불가
        - 애플리케이션의 정적 분석은 `main` 진입점에서 빌드 타임에 수행. ↔︎ 런타임 시점에 실행 환경을 계속 수집하고 동적으로 분석하여 애플리케이션을 최적화
            - 클래스 경로는 빌드 시 고정되고 완전히 정의 ↔︎ 런타임에 클래스와 메서드를 동적으로 정의
                - 애플리케이션이 실행될 때 사용할 클래스와 메서드를 미리 결정
                - 런타임에는 동적으로 클래스와 종속성 처리를 하지 않음
            - 애플리케이션을 실행할 환경의 OS, CPU, 메모리 등을 애플리케이션 실행시키기 전 미리 분석하여 최적화를 진행
- Native Image 만들어지는 과정
    1. Java 소스코드를 바이트코드로 컴파일 합니다.
    2. 코드에서 메타데이터를 추출합니다.[3)](https://www.graalvm.org/latest/reference-manual/native-image/metadata/)
        - 기존 동적으로 생성되는 부분은 Native Image 빌드 시 정보가 전달되어야 합니다.
            - 동적 클래스 로딩
            - 리플렉션
            - 리소스
            - 직렬화
            - 동적 프록시
    3. 바이트코드와 메타데이터로 Native Image로 컴파일 합니다.
- 정리
    
    
    |  | JIT 컴파일러(Jar) | AOT 컴파일러(Native Image) |
    | --- | --- | --- |
    | 기계어 생성 시점 | 런타임에 기계어 생성 | 빌드 타임에 코드에 대한 정적 코드 테스트를 진행하고 그것을 기반으로 기계어를 생성 |
    | 최적화 | 런타임에 애플리케이션 실행 환경 상황(할당받은 코어, OS, 커널 버전, CPU 등)에 맞춘 최적화 코드 생성 | 빌드 타임에 복잡한 분석 및 최적화가 수행Native Image가 실행할 OS 환경의 실행파일을 만들기 때문에 컴파일의 결과물이 특정 OS에 JDK를 설치할 필요가 없고 빠르게 실행 될 수 있음 |
    | 단점 | 런타임에 오버헤드가 발생할 수 있음 | 런타임에는 최적화가 진행되지 않습니다. <br> 실행하기 전에 이미 특정 OS 환경에 맞게 기계어로 컴파일을 진행했기 때문에 실행 환경 정보 수집이 어렵습니다 <br> 아직 코드 최적화가 부족 |

- JIT vs AOT
    - JIT(Just-In-Time) 컴파일러 - 런타임에 기계어를 생성
        - 상황에 맞춘 최적화 코드를 생성할 수 있습니다.(할당받은 코어, OS, 커널 버전, CPU 등)
        - 런타임에 오버헤드가 발생할 수 있습니다.
        - C1, C2 컴파일러로 구성되어 있습니다.
        
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/11.png)
        
    - AOT(Ahead-Of-Time) 컴파일러 - 실행하기 전에 코드에 대한 정적 코드 테스트를 진행하고 그것을 기반으로 기계어를 생성
        - 실행 전에 무겁고 복잡한 분석 및 최적화가 수행됩니다.
            - 미리 타깃 OS에 즉시 실행가능한 파일을 만듬 → 컴파일의 결과물이 특정 OS에 Java를 설치할 필요도 없게 되고 JIT가 동작을 할 필요가 없기 때문에 빠르게 실행이 될 수 있는 장점입니다.
        - 런타임에는 최적화가 진행되지 않습니다.
            - 실행하기 전에 이미 특정 OS 환경에 맞게 기계어로 컴파일을 진행했기 때문에 실행 환경 정보 수집이 어렵습니다.
        - 아직 코드 최적화가 부족합니다
    - 결론
      - 메모리 구조 차이
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/12.png)
      - 애플리케이션 실행 시간/메모리 비교
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/13.png)
      - 애플리케이션 CPU 사용량 비교
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/14.png) 
      - 요청 처리량 비교
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/15.png)
    - 결론
        - 빠른 실행과 종료가 필요한 애플리케이션은 AOT 컴파일러
        - 오랜 시간동안 고성능으로 운영이 필요한 애플리케이션은 JIT 컴파일러
- Spring Native
    - 일반적인 SpringBoot 애플리케이션은 매우 동적이고 구성은 런타임에 수행됩니다. 하지만 Native Image를 사용하기 위해선 SpringBoot의 장점인 동적으로 할당하고 실행하던 기능을 포기해야합니다.
    - Native Image는 메모리 용량과 실행시간을 줄이기 위한 최적화가 진행되는 데 이때 모든 코드가 정의되어 있다는 닫힌 세계(Closed World) 가정되기 때문에 동적인 측면에 제한 사항이 있습니다.
        - 닫힌 세계
            - 런타임에 동적으로 새로운 요소를 추가할 수 없습니다.
                - 프록시, DI, 리플렉션 API 사용 불가
            - Spring `@Profile` 및 profile 별 구성에는 제한 사항이 있습니다.
                - profile을 사용하는 경우 빌드 시 지정해야 합니다.
    - **Spring Native가 메타데이터를 GraalVM 이 원하는 형태로 Native Image 로 변환할 수 있는 것에 대한 자동화 프로세스를 지원합니다.**
        - 하지만 Spring 내장 기본 지원은 초기 단계 기능이기 때문에 직접적으로 추가해야 할 부분이 많습니다.
    
    ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/17.png)
    
    - Spring AOT processing 결과물
        - 자바 소스 코드
        - 바이트코드
        - GraalVM JSON 힌트 파일
            - 리소스 힌트(`resource-config.json`)
            - 리플렉션 힌트(`reflect-config.json`)
            - 직렬화 힌트(`serialization-config.json`)
            - Java 프록시 힌트(`proxy-config.json`)
            - JNI 힌트(`jni-config.json`)
  - GraalVM 환경 세팅
    - GraalVM Community Edition 설치
        
        ![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/16.png)
        
    - build.gradle
        
        ```groovy
        plugins {
          // ...
        
          // Apply GraalVM Native Image plugin
          id 'org.graalvm.buildtools.native' version '0.10.2'/
        }
        ```
        
    - 이미지 생성
        
        ```groovy
        // Docker Image 생성
        gradle bootBuildImage
        
        // native Image 생성 (GraalVM 필요)
        gradle nativeCompile
        ```
|JIT|Spring Native||
|:---:|:---:|:---:|
|![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/18.png)|![](./images/What's_new_in%20_Java_17_and_Spring_Boot_3/19.png)|

## **HTTP Interface**

- HTTP Interface
    - 개발자가 `@HttpExchange` 메서드와 함께 자바 인터페이스를 사용하여 HTTP 서비스를 정의할 수 있습니다. → 이전에는 어떻게
    - 해당 서비스를 정의된 인터페이스를 기반으로 프록시 객체를 생성하면 프록시가 인터페이스를 구현하고 HTTP 전송을 수행합니다.
    - 인터페이스를 `HttpServiceProxyFactory` 에 전달하여 `RestClient` 또는 `WebClient`와 같은 HTTP 클라이언트를 통해 요청을 수행하는 프록시를 생성할 수 있습니다.
    - 서버 요청 처리를 위해서 `@Controller` 에서 인터페이스를 구현할 수 있습니다.
- 예제 코드
    - `@HttpExchange` 메서드를 사용하여 인터페이스를 만듭니다.
    
    ```java
    @HttpExchange(url = "/repos/{owner}/{repo}", accept = "application/vnd.github.v3+json")
    interface RepositoryService {
    
    	@GetExchange
    	Repository getRepository(@PathVariable String owner, @PathVariable String repo);
    
    	@PatchExchange(contentType = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    	void updateRepository(@PathVariable String owner, @PathVariable String repo,
    			@RequestParam String name, @RequestParam String description, @RequestParam String homepage);
    
    }
    ```
    
    - 메서드가 호출될 때 요청을 수행하는 프록시를 만들어야 합니다.
        - `RestClient`
            
            ```java
            RestClient restClient = RestClient.builder().baseUrl("https://api.github.com/").build();
            RestClientAdapter adapter = RestClientAdapter.create(restClient);
            HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();
            
            RepositoryService service = factory.createClient(RepositoryService.class);
            ```
            
        - `WebClient`
            
            ```java
            WebClient webClient = WebClient.builder().baseUrl("https://api.github.com/").build();
            WebClientAdapter adapter = WebClientAdapter.create(webClient);
            HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();
            
            RepositoryService service = factory.createClient(RepositoryService.class);
            ```
            
        - `RestTemplate`
            
            ```java
            // 빈을 등록해서 필요할 때 사용하도록
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.setUriTemplateHandler(new DefaultUriBuilderFactory("https://api.github.com/"));
            RestTemplateAdapter adapter = RestTemplateAdapter.create(restTemplate);
            HttpServiceProxyFactory factory = HttpServiceProxyFactory.builderFor(adapter).build();
            
            RepositoryService service = factory.createClient(RepositoryService.class);
            ```
- Exchange Methods
    - `@HttpExchange` 는 HTTP 인터페이스와 해당 Exchange Methods에 적용할 수 있는 루트 어노테이션입니다.
    - 인터페이스 수준에서 적용하는 경우 모든 교환 메서드에 적용됩니다.
        - Content-Type 이나 URL과 같은 모든 인터페이스 메서드에 공통적인 속성을 지정하는데 유용할 수 있습니다.
    - `@GetExchange` : HTTP GET
    - `@PostExchange` : HTTP POST
    - `@PutExchange` : HTTP PUT
    - `@PatchExchange` : HTTP PATCH
    - `@DeleteExchange` : HTTP DELETE
    
    ```java
    interface BooksService {
    
        @GetExchange("/books")
        List<Book> getBooks();
    
        @GetExchange("/books/{id}")
        Book getBook(@PathVariable long id);
    
        @PostExchange("/books")
        Book saveBook(@RequestBody Book book);
    
        @DeleteExchange("/books/{id}")
        ResponseEntity<Void> deleteBook(@PathVariable long id);
    }
    ```
- 특징
    - 선언적인 REST 클라이언트로서 서비스 간의 통신을 자동화합니다.
    - 인터페이스 기반의 API 정의로 간단하고 직관적인 코드 작성이 가능합니다.
    - 사용하는 쪽에서는 구체적인 구현이 어떻게 되어있는지 몰라도 인터페이스를 구현한 빈에서 제공하는 서비스를 이용하기만 하면 됩니다.

# **3. 결론**

## **3-1. SpringBoot 2 → 3 정리**

- **Java 17**
    - 신 기능 중 유용하게 사용해 볼 수 있는 부분은 웹 개발시 Record 클래스를 사용해서 DTO로 설계
- **SpringBoot**
    - SpringBoot에서도 HTTP Interface 를 이용하면 좀 더 깔끔한 코드로 작성 가능

## **3-2. Spring Native**

- Spring Native 초기 단계 기능이기 때문에 오류가 많고 Native Image 생성하기 위한 메타데이터 설정은 개발자가 직접적으로 추가해야 할 부분이 많음
    
    또 [Native Image에서 지원하는 라이브러리나 프레임워크가 얼마 없기 때문에](https://www.graalvm.org/native-image/libraries-and-frameworks/) 실질적으로 외부 라이브러리를 많이 사용하는 실제 운영 애플리케이션에서 Native Image로 이용하는 것은 어려움
    
    하지만 GraalVM 과 Spring Native에 관심은 계속해서 가져야 함
    
- 오라클 사에서 GraalVM을 엄청난 노력과 개발을 진행하여 [AOT의 성능이 JIT보다 뛰어난 성능을 최근에 보여주고 있고](https://medium.com/graalvm/graalvm-for-jdk-21-is-here-ee01177dd12d) Native Image에서 많은 외부 라이브러리를 지원하기 위한 테스트도 진행 중
    
    클라우드 환경에 맞춘 스프링 애플리케이션을 만들기 위해 Spring 개발팀에서 Spring Native 기능으로 메타데이터 구성 및 호환성을 더욱 단순화하기위해 GraalVM 과 협업하여 집중적으로 개발이 진행 중
    
    향후 스프링 개발 트렌드가 Native Image로 생성된 애플리케이션을 운영할 것이라 예상

# **참고**

Java

- https://blogs.oracle.com/javakr/post/java-17-webcast-brief
- https://techblog.gccompany.co.kr/%EC%9A%B0%EB%A6%AC%ED%8C%80%EC%9D%B4-jdk-17%EC%9D%84-%EB%8F%84%EC%9E%85%ED%95%9C-%EC%9D%B4%EC%9C%A0-ced2b754cd7
- [자바 17의 새로운 기능들, 3년 만에 LTS 버전 릴리즈!](https://madplay.github.io/post/what-is-new-java-17)
- [Programmer's Guide to Text Blocks](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html)
- [Sealed Classes and Interfaces in Java 15 | Baeldung](https://www.baeldung.com/java-sealed-classes-interfaces)
    
- [Java Language Updates](https://docs.oracle.com/en/java/javase/17/language/records.html)
    
- [Java 14 Record Keyword | Baeldung](https://www.baeldung.com/java-record-keyword)

JVM

- [Chapter 2. The Structure of the Java Virtual Machine](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)
- [☕ JVM 내부 구조 & 메모리 영역 💯 총정리](https://inpa.tistory.com/entry/JAVA-%E2%98%95-JVM-%EB%82%B4%EB%B6%80-%EA%B5%AC%EC%A1%B0-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EC%98%81%EC%97%AD-%EC%8B%AC%ED%99%94%ED%8E%B8)
    
- [Java Platform, Standard Edition JRockit to HotSpot Migration Guide](https://docs.oracle.com/javacomponents/jrockit-hotspot/migration-guide/comp-opt.htm#JRHMG117)
    
SpringBoot 3

- [Spring Boot 3.0 무엇이 달라질까?](https://revf.tistory.com/260)
- [스프링 6 / 스프링 부트 3.0 버전 변경 사항 정리 [ 스프링 부트(Spring Boot) 기초 ]](https://www.youtube.com/watch?v=ii6Iww6BCVI)

GraalVM

- [JEP 243: Java-Level JVM Compiler Interface](https://openjdk.org/jeps/243)
- [GraalVM](https://www.graalvm.org/latest/docs/)
- [GraalVM 소개 | Oracle](https://www.oracle.com/kr/java/graalvm/what-is-graalvm/)
- [[Java] Hotspot VM의 한계(JIT, Just-In-Time 컴파일러)와 이를 극복하기 위한 GraalVM의 등장](https://mangkyu.tistory.com/301)

Native Image

- [Native Image](https://www.graalvm.org/latest/reference-manual/native-image/)
    
    https://www.graalvm.org/resources/img/favicon/favicon-light/favicon-light.ico
    
- https://www.graalvm.org/22.1/reference-manual/native-image/Limitations/
- [Libraries and Frameworks Ready for GraalVM Native Image](https://www.graalvm.org/native-image/libraries-and-frameworks/)
- https://blogs.oracle.com/javakr/post/graalvm-nativeimage-revisited
- [Command-line Options](https://www.graalvm.org/latest/reference-manual/native-image/overview/Options/)

Spring Native

- https://docs.spring.io/spring-boot/docs/current/reference/html/native-image.html
- [GraalVM, Spring Native 맛보기 : NHN Cloud Meetup](https://meetup.nhncloud.com/posts/273)
- [Native Images with Spring Boot and GraalVM | Baeldung](https://www.baeldung.com/spring-native-intro)
- [New AOT Engine Brings Spring Native to the Next Level](https://spring.io/blog/2021/12/09/new-aot-engine-brings-spring-native-to-the-next-level)
- [Spring GraalVM Native Image 띄어보기](https://velog.io/@akfls221/Spring-GraalVM-Native-Image)
- [[Java] GraalVM이 제공하는 네이티브 이미지(Native Image)](https://mangkyu.tistory.com/302)
    
- 적용 사례
  - [쿠버네티스가 스프링부트 3.0 네이티브 이미지를 만났네 - 넷마블 기술 블로그](https://netmarble.engineering/spring-boot-3-0-native-image-on-kubernetes/)

- 참고 영상
  - [[25th Developer Meetup] 한 단계 진화한 GraalVM, Spring Native 활용해 보기](https://www.youtube.com/watch?v=54rxc2dEv10)
  - [Going Native: Fast and Lightweight Spring Boot Applications with GraalVM by Alina Yurenko](https://www.youtube.com/watch?v=8umoZWj6UcU)

HTTP/RSocket Interface

- https://docs.spring.io/spring-framework/reference/integration/rest-clients.html#rest-http-interface
- [HTTP Interface in Spring 6 | Baeldung](https://www.baeldung.com/spring-6-http-interface)  
- [Spring 6의 새로운 HTTP Interface와 3 가지 REST Clients 라이브 코딩](https://www.youtube.com/watch?v=Kb37Q5GCyZs)

## 💡 틀렸거나 잘못된 정보가 있다면 망설임 없이 댓글로 알려주세요!