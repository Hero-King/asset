(window.webpackJsonp=window.webpackJsonp||[]).push([[71],{491:function(a,t,n){"use strict";n.r(t);var s=n(31),e=Object(s.a)({},(function(){var a=this,t=a._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h1",{attrs:{id:"https-权威指南"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#https-权威指南"}},[a._v("#")]),a._v(" Https 权威指南")]),a._v(" "),t("h2",{attrs:{id:"ssl-tls"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#ssl-tls"}},[a._v("#")]),a._v(" SSL/TLS")]),a._v(" "),t("h3",{attrs:{id:"重要性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#重要性"}},[a._v("#")]),a._v(" 重要性")]),a._v(" "),t("p",[a._v("所有连接到互联网的设备都有一个共同点，它们依赖安全套接字层（secure socket layer，SSL）\n和传输层安全（transport layer security，TLS）协议保护传输的信息。")]),a._v(" "),t("h3",{attrs:{id:"网络模型"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#网络模型"}},[a._v("#")]),a._v(" 网络模型:")]),a._v(" "),t("p",[a._v("SSL 和 TLS 它用于 TCP 协议之上，上层协议\n（如 HTTP）之下。当不需要加密时，可以将 TLS 从模型中去掉，这并不会对上层协议产生影响（它\n们将直接与 TCP 协同工作）。当需要加密时，就可以利用 TLS 加密 HTTP，以及其他 TCP 协议（比\n如 SMTP、IMAP 等）。")]),a._v(" "),t("h3",{attrs:{id:"密码学"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#密码学"}},[a._v("#")]),a._v(" 密码学")]),a._v(" "),t("p",[a._v("**散列函数（hash function）**是将任意长度的输入转化为定长输出的算法。散列函数的结果经\n常被简称为散列（hash）。 散列函数经常被称为指纹、消息摘要，或者简单称为摘要。\n现在使用最为广泛的散列函数是 SHA1，它的输出是 160 位。因为 SHA1 已经变弱，所以建议\n升级为 SHA256 的变种。与密码不同，散列函数的强度并不与散列长度对等。")]),a._v(" "),t("p",[t("strong",[a._v("非对称加密")]),a._v("（asymmetric encryption）又称为公钥加密（public key cryptography），它是另一\n种方法，使用两个密钥，而不是一个；其中一个密钥是私密的，另一个是公开的。顾名思义，一\n个密钥用于私人，另一个密钥将会被所有人共享。这两个密钥之间存在一些特殊的数学关系，使\n得密钥具备一些有用的特性。如果你利用某人的公钥加密数据，那么只有他们对应的私钥能够解\n密，如图 1-5 所示。从另一个方面讲，如果某人用私钥加密数据，任何人都可以利用对应的公钥\n解开消息。后面这种操作不提供机密性，但可以用作数字签名。 RSA 是目前最普遍部署的非对称加密算法")]),a._v(" "),t("p",[t("strong",[a._v("数字签名")]),a._v(" 我们可以利用公钥密码的非对\n称性设计出一种算法，使用私钥对消息进行签名，并使用对应的公钥验证它。\n(1) 计算希望签名的文档的散列。不论输入文档的长度如何，输出长度总是固定的。比如，\n使用 SHA256 就是 256 位。\n(2) 对结果散列和一些额外的元数据进行编码。比如，接收方需要知道你使用的散列算法，\n否则不能处理签名。\n(3) 使用私钥加密编码过的数据，其结果就是签名，可以追加到文档中作为身份验证的依据。\n为了验证签名，接收方接收文档并使用相同的散列算法独立计算文档散列。接着，她使用公\n钥对消息进行解密，将散列解码出来，再确认使用的散列算法是否正确，解密出的散列是否与本\n地计算的相同。这个方案的强度取决于加密、散列以及编码组件各自的强度。")]),a._v(" "),t("blockquote",[t("p",[a._v("并非所有的数字签名算法都与 RSA 的工作方式一致。事实上，RSA 是一个特例，因为\n它可以同时用于加密和数字签名。其他流行的公钥密码算法则不能用于加密，比如\nDSA 和 ECDSA，它们依赖其他方式进行签名。")])]),a._v(" "),t("h2",{attrs:{id:"协议"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#协议"}},[a._v("#")]),a._v(" 协议")]),a._v(" "),t("h3",{attrs:{id:"握手协议"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#握手协议"}},[a._v("#")]),a._v(" 握手协议")]),a._v(" "),t("p",[a._v("在这个过程中，通信双方协商连接参数，并且完成身份验证。根据使用的功能的不同，整个过程通常需要交换 6~10 条消息。\n根据配置和支持的协议扩展的不同，交换过程可能有许多变种。在使用中经常可以观察到以下三种流程：(1) 完整的握手，\n对服务器进行身份验证；(2) 恢复之前的会话采用的简短握手；(3) 对客户端和服务器都进行身份\n验证的握手。")]),a._v(" "),t("h3",{attrs:{id:"tls-建立过程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#tls-建立过程"}},[a._v("#")]),a._v(" TLS 建立过程")]),a._v(" "),t("p",[a._v("(1) 客户端开始新的握手，并将自身支持的功能提交给服务器。\n(2) 服务器选择连接参数。\n(3) 服务器发送其证书链（仅当需要服务器身份验证时）。\n(4) 根据选择的密钥交换方式，服务器发送生成主密钥的额外信息。\n(5) 服务器通知自己完成了协商过程。\n(6) 客户端发送生成主密钥所需的额外信息。\n(7) 客户端切换加密方式并通知服务器。\n(8) 客户端计算发送和接收到的握手消息的 MAC 并发送。\n(9) 服务器切换加密方式并通知客户端。\n(10) 服务器计算发送和接收到的握手消息的 MAC 并发送。")]),a._v(" "),t("h3",{attrs:{id:"秘钥交换算法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#秘钥交换算法"}},[a._v("#")]),a._v(" 秘钥交换算法")]),a._v(" "),t("p",[a._v("dh_anon Diffie-Hellman（DH）密钥交换，未经身份验证\ndhe_rsa 临时 DH 密钥交换，使用 RSA 身份验证\necdh_anon 临时椭圆曲线 DH（elliptic curve DH，ECDH）密钥交换，未经身份验证（RFC 4492）\necdhe_rsa 临时 ECDH 密钥交换，使用 RSA 身份验证（RFC 4492）\necdhe_ecdsa 临时 ECDH 密钥交换，使用 ECDSA 身份验证（RFC 4492）\nkrb5 Kerberos 密钥交换（RFC 2712）\nrsa RSA 密钥交换和身份验证\npsk 预共享密钥（pre-shared key，PSK）密钥交换和身份验证（RFC 4279）\ndhe_psk 临时 DH 密钥交换，使用 PSK 身份验证（RFC 4279）\nrsa_psk PSK 密钥交换，使用 RSA 身份验证（RFC 4279）\nsrp 安全远程密码（secure remote password，SRP）密钥交换和身份验证（RFC 5054）")]),a._v(" "),t("p",[a._v("使用哪一种密钥交换由协商的套件所决定。一旦套件决定下来，两端都能了解按照哪种算法\n继续操作。实际使用的密钥交换算法主要有以下 4 种。\nRSA\nDHE_RSA (临时 Diffie-Hellman（ephemeral Diffie-Hellman，DHE）密钥交换 在 TLS 中，DHE 通常与 RSA 身份验证联合使用。)\nECDHE_RSA 和 ECDHE_ECDSA")]),a._v(" "),t("h3",{attrs:{id:"加密"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#加密"}},[a._v("#")]),a._v(" 加密")]),a._v(" "),t("p",[a._v("TLS 可以使用各种方法加密数据，比如使用 3DES、AES、ARIA、CAMELLIA、RC4 或者 SEED\n等算法。目前使用最为广泛的加密算法是 AES。")]),a._v(" "),t("h2",{attrs:{id:"部署-tls"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#部署-tls"}},[a._v("#")]),a._v(" 部署 TLS")]),a._v(" "),t("h3",{attrs:{id:"证书"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#证书"}},[a._v("#")]),a._v(" 证书")]),a._v(" "),t("p",[a._v("证书主要有三种类型：域名验证（domain validated，DV）、组织验证（organization validated，\nOV）和扩展验证（extended validation，EV）。DV 证书的签发是自动的，通常也是最便宜的，一\n般的网站使用 DV 证书就足够了。OV 证书需要验证域名拥有者的公司信息，并且在证书中包含公\n司信息。尽管如此，浏览器实际上并不区分 OV 和 DV 证书，也不会展示出证书包含的所有信息。")]),a._v(" "),t("h4",{attrs:{id:"证书主机名"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#证书主机名"}},[a._v("#")]),a._v(" 证书主机名")]),a._v(" "),t("p",[a._v("证书的主要作用就是为保障用户安全顺畅地访问域名建议合适的信任机制。在互联网上，用\n户经常会收到一些证书域名不匹配的警告，这往往是由于使用的证书不能匹配该域名的不同变体\n（比如证书域名是www.example.com，无法匹配example.com域名）。\n为了避免上述问题，请遵守一个简单的规则：只要有一个 DNS 解析指向你的 TLS 服务器，就务必保证你的证书包括了这个 DNS 域名。")]),a._v(" "),t("h3",{attrs:{id:"证书共享"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#证书共享"}},[a._v("#")]),a._v(" 证书共享")]),a._v(" "),t("p",[a._v("证书共享大致分为两种类型。第一种：你可以签发一个包含所有需要域名的证书（例如，\nwww.example.com、example.com和log.example.com）。第二种：你可以签发一个泛域名证书，可\n用于所有关联的子域名（例如，签发一个*.example.com 和 example.com 的泛域名证书）。")]),a._v(" "),t("p",[a._v("多域名证书的优点是降低了维护成本并且可以让多个 https 网站共用一个 IP 地址。这种证书在\nCDN 上使用很普遍，因为 CDN 经常会需要对很多不同的外部用户提供服务。")]),a._v(" "),t("p",[a._v("原则上，使用多域名证书并没有什么问题，但前提是它不会降低你的系统安全性，而现实是\n这种证书的使用确实会对安全性有影响。从本质上来讲，当多个域名共用一个证书时，事实上它\n们也就共用了一个相同的私钥。因此，当你的一组网站是由不同团队运营或者根本各不相关时，\n就不应该对这些网站使用多域名证书。因为如果其中一个网站被攻击，被窃取的私钥就可以用来\n攻击所有共用这个证书的其他网站，另外在发生攻击后，你也需要对这组网站全部更新一遍密钥。")]),a._v(" "),t("h2",{attrs:{id:"openssl"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#openssl"}},[a._v("#")]),a._v(" openssl")]),a._v(" "),t("h3",{attrs:{id:"密钥和证书管理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#密钥和证书管理"}},[a._v("#")]),a._v(" 密钥和证书管理")]),a._v(" "),t("p",[a._v("大多数用户借助 OpenSSL 是因为希望配置并运行能够支持 SSL 的 Web 服务器。整个过程包括 3\n个步骤：(1) 生成强加密的私钥；(2) 创建证书签名申请（certificate signing request，CSR）并且发\n送给 CA；(3) 在你的 Web 服务器上安装 CA 提供的证书。这些步骤（还有其他一些）会在本节详细\n说明。")]),a._v(" "),t("ul",[t("li",[t("p",[a._v("生成密钥 - 秘钥算法 (OpenSSL 支持 RSA、DSA 和 ECDSA 密钥，但是在实际使用场景中不是所有密钥类型都适\n用的。例如对于 Web 服务器的密钥，所有人都使用 RSA，因为 DSA 一般因为效率问题会\n限制在 1024 位（Internet Explorer 不支持更长的 DSA 密钥），而 ECDSA 还没有被大部分的\nCA 支持。对于 SSH 来说，一般都是使用 DSA 和 RSA，而不是所有的客户端都支持 ECDSA\n算法。) - 密钥长度 (默认的密钥长度一般都不够安全，所以我们需要指定要配置的密钥长度。例如 RSA 密钥\n默认的长度是 512 位，非常不安全。如果今天你的服务器上还是用 512 位的密钥，入侵者可以先获取你的证书，使用暴力方式来算出对应的私钥，之后就可以冒充你的站点了。\n现在，一般认为 2048 位的 RSA 密钥是安全的，所以你应该采用这个长度的密钥。DSA 密\n钥也应该不少于 2048 位，ECDSA 密钥则应该是 256 位以上。) - 密码(强烈建议使用密码去保存密钥，虽然这是只一个可选项。受密码保护的密钥可以被安全地存储、传输以及备份。)")])]),a._v(" "),t("li",[t("p",[a._v("创建证书签名申请 （certificate signing request，CSR）(要求 CA\n给证书签名的一种正式申请，该申请包含申请证书的实体的公钥以及该实体的某些信息。该数据\n将成为证书的一部分)")])]),a._v(" "),t("li",[t("p",[a._v("自签名证书(如果你只是想安装一台自己使用的 TLS 服务器，那么可以不必找 CA 去获取一个公开信任的\n证书，自己就可以直接签发一个。)")]),a._v(" "),t("blockquote",[t("p",[a._v("申请权威机构的 CA 证书 VS 自签名 CA 证书"),t("br"),a._v("\n1、权威 CA 机构申请的证书要花银子，自签证书不要银子\n2、自签证书会出现 google 浏览器不认的情况，比较麻烦。漏洞也多，对安全不利。"),t("br"),a._v("\n3、使用机构签发的证书时候需要联网签发，内网机器不用想"),t("br"),a._v(" "),t("strong",[a._v("所以公网服务踏实的买证书，内网机器踏实的自签证书。")])])])]),a._v(" "),t("li",[t("p",[a._v("创建对多个主机名有效的证书")])])])])}),[],!1,null,null,null);t.default=e.exports}}]);